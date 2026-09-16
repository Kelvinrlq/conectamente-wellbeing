import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ArrowLeft, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { rastrear } from "@/lib/track";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Conversa Amiga — ConectaMente" },
      {
        name: "description",
        content:
          "Bate-papo anônimo e seguro de apoio emocional para estudantes. Sem cadastro, sem armazenamento.",
      },
    ],
  }),
  component: ChatRoute,
});

const WELCOME: UIMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    parts: [
      {
        type: "text",
        text:
          "Oi! Eu sou a sua **Conversa Amiga** 💙\n\nEste é um espaço **anônimo** e **seguro**. Nada do que você escrever aqui é guardado.\n\nComo você está se sentindo agora?",
      },
    ],
  },
];

function ChatRoute() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({
    id: "conecta-mente-anonimo",
    messages: WELCOME,
    transport,
    onError: (err) => {
      const msg = err?.message ?? "";
      if (msg.includes("429")) toast.error("Muitas mensagens — aguarde um instante e tente novamente.");
      else if (msg.includes("402")) toast.error("Créditos esgotados. Adicione créditos no workspace.");
      else toast.error("Não consegui responder agora. Tente de novo em alguns segundos.");
    },
  });

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (status === "ready") inputRef.current?.focus();
  }, [status]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col">
      <div className="px-5 pt-5">
        <Link to="/apoio" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground">
          <ArrowLeft className="h-3 w-3" /> Apoio
        </Link>
      </div>
      <AppHeader subtitle="Conversa Amiga" />

      <div className="px-5">
        <div className="flex items-start gap-3 rounded-xl border border-aqua/50 bg-aqua/15 p-4">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-aqua-foreground" />
          <p className="text-sm leading-relaxed text-aqua-foreground">
            <strong>Anônimo · Não armazenamos suas mensagens.</strong> Em emergência, ligue{" "}
            <a className="font-bold underline" href="tel:188">CVV 188</a> ou{" "}
            <a className="font-bold underline" href="tel:192">SAMU 192</a>.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 px-2 pt-3 pb-2">
        <Conversation className="h-full">
          <ConversationContent className="px-3">
            {messages.map((m) => (
              <Message key={m.id} from={m.role}>
                <MessageContent>
                  {m.parts.map((p, i) => {
                    if (p.type === "text") {
                      return m.role === "assistant" ? (
                        <MessageResponse key={i}>{p.text}</MessageResponse>
                      ) : (
                        <span key={i}>{p.text}</span>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" ? (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer>Pensando...</Shimmer>
                </MessageContent>
              </Message>
            ) : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <div className="border-t border-border bg-background px-3 pt-2 pb-3">
        <PromptInput
          onSubmit={async (msg) => {
            const text = msg.text.trim();
            if (!text || isLoading) return;
            if (messages.length === 0) rastrear("chat", "Conversa iniciada");
            rastrear("chat", "Mensagem enviada");
            await sendMessage({ text });
          }}
        >
          <PromptInputTextarea
            ref={inputRef}
            placeholder="Conte como você está se sentindo..."
            autoFocus
          />
          <PromptInputFooter className="justify-between">
             <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3" /> Não substitui atendimento profissional.
            </span>
            <PromptInputSubmit status={status} disabled={isLoading} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
