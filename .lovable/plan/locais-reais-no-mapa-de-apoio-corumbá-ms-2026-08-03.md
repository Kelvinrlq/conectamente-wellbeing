# Locais reais no mapa de apoio (Corumbá-MS)

Substituir os dados de exemplo pelos 11 locais enviados e renomear o filtro "Psicólogos Online" para "Psicólogos".

## Locais

Psicólogos
1. Psicóloga Maria Angélica C. C. Formiga — Alameda Maria Antônia de Carvalho, 05, Cristo Redentor
2. Márcia Barbosa Psicóloga Infantil — R. Pedro de Medeiros, 7, Popular Velha
3. Psicóloga Bruna Mariana de Oliveira Lemos — R. Barão de Melgaço, 35, Universitário (atende também on-line)
4. Consultório Psicológico Drª Sandra — R. Maj. Gama, 145, Centro

Rede Pública
5. UBS da Ladeira — Ladeira Cunha e Cruz, 2-122, Centro
6. UBS São Bartolomeu — R. Pernambuco, 374-396, Vila Guarani
7. UBS Angélica Anache — Cristo Redentor
8. CAPS I — R. Cuiabá, 1291, Centro
9. CAPS II José Fragelli — R. Ten. Melquíades de Jesus, 532, Centro
10. CRAS IV — R. Joaquim Murtinho, 2117, Aeroporto
11. CRAS Albuquerque — Praça Céu, R. Mal. Deodoro, 2185-2339, Popular Nova

O CVV (188) continua na lista como contato de emergência, sem marcador no mapa.

## O que muda

1. `src/data/locais.ts`: os 11 locais com endereço e coordenadas obtidas por geocodificação dos endereços; rótulo do filtro passa a ser "Psicólogos".
2. Telefone: nenhum número foi enviado. Onde não houver telefone, o card mostra só endereço e o botão "Google Maps" (sem botão de ligar). Se você mandar os telefones depois, eu adiciono.
3. Verificação no preview: conferir que cada pino cai no bairro/rua correto e ajustar manualmente qualquer coordenada imprecisa.

## Observações técnicas

- Coordenadas via geocodificação (Nominatim/OpenStreetMap) no momento da edição; ficam fixas no arquivo, sem chamadas em runtime.
- Endereços sem número exato (UBS Angélica Anache) recebem a coordenada do ponto mais preciso encontrado; o botão "Google Maps" busca por nome + endereço, o que resolve pequenas imprecisões.
- Corrigir também o erro de renderização no servidor do mapa (`window is not defined`) carregando o Leaflet apenas no cliente.
