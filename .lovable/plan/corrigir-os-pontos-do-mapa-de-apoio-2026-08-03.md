# Corrigir os pontos do mapa de apoio

Hoje o arquivo `src/data/locais.ts` tem apenas pontos de exemplo, com coordenadas aproximadas do centro de Corumbá — por isso nenhum marcador cai no lugar certo. O mapa e a lista da tela `/mapa` leem exatamente esse arquivo, então basta substituir os dados por informações reais.

## O que eu preciso de você

Envie a lista dos locais de saúde mental de Corumbá-MS, um por linha, no formato:

```text
Nome do local | Endereço completo (rua, número, bairro) | Telefone | Categoria
```

Categoria pode ser: `Rede Pública (CAPS/UBS)` ou `Psicólogos Online`.

Alternativa ainda mais precisa: para cada local, abra no Google Maps, clique com o botão direito no ponto exato e copie as coordenadas (ex.: `-19.0093, -57.6541`). Se você mandar as coordenadas, o marcador fica exato.

## O que eu faço com a lista

1. Converto cada endereço em latitude/longitude (ou uso as coordenadas que você enviar).
2. Reescrevo `src/data/locais.ts` com os locais reais, removendo os exemplos.
3. Ajusto o centro e o zoom inicial do mapa para enquadrar todos os pontos reais.
4. Removo o aviso "Os pontos exibidos são exemplos..." no rodapé da página.
5. Verifico no preview que cada marcador cai no endereço correto.

## Observações técnicas

- Locais sem endereço físico (atendimento online) continuam na lista de cards, mas sem marcador no mapa, para não poluir com pinos falsos.
- O botão "Google Maps" de cada card passa a buscar pelo nome + endereço, o que abre o local certo mesmo em caso de pequena imprecisão nas coordenadas.
