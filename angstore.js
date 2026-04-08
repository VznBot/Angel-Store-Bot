require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  PermissionsBitField,
  ChannelType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID;
const TICKET_CATEGORY_ID = process.env.TICKET_CATEGORY_ID;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;
const PIX_KEY = process.env.PIX_KEY;

const catalog = [
  {
    id: 'ig_seg_br',
    label: 'Instagram Seguidores BR',
    emoji: '🇧🇷',
    description: 'Seguidores brasileiros',
    products: [
      ['100 seguidores', '3.00'],
      ['300 seguidores', '9.00'],
      ['500 seguidores', '15.00'],
      ['1000 seguidores', '30.00'],
      ['1500 seguidores', '45.00'],
      ['2000 seguidores', '60.00'],
      ['3000 seguidores', '90.00'],
      ['5000 seguidores', '180.00'],
      ['8000 seguidores', '220.00'],
      ['10000 seguidores', '280.00']
    ]
  },
  {
    id: 'ig_seg_world',
    label: 'Instagram Seguidores Mundial',
    emoji: '🌍',
    description: 'Seguidores mundiais',
    products: [
      ['1000 seguidores', '15.00'],
      ['2000 seguidores', '30.00'],
      ['3000 seguidores', '45.00'],
      ['5000 seguidores', '75.00'],
      ['10000 seguidores', '150.00'],
      ['20000 seguidores', '300.00']
    ]
  },
  {
    id: 'ig_views',
    label: 'Instagram Views Reels/IGTV',
    emoji: '🎬',
    description: 'Visualizações para Reels ou IGTV',
    products: [
      ['1000 visualizações', '5.00'],
      ['2000 visualizações', '10.00'],
      ['3000 visualizações', '15.00'],
      ['5000 visualizações', '25.00'],
      ['8000 visualizações', '40.00'],
      ['10000 visualizações', '50.00']
    ]
  },
  {
    id: 'ig_likes_br',
    label: 'Instagram Curtidas BR',
    emoji: '❤️',
    description: 'Curtidas brasileiras',
    products: [
      ['100 curtidas', '4.00'],
      ['300 curtidas', '12.00'],
      ['500 curtidas', '20.00'],
      ['1000 curtidas', '40.00'],
      ['1500 curtidas', '60.00'],
      ['2000 curtidas', '80.00'],
      ['3000 curtidas', '120.00'],
      ['5000 curtidas', '200.00'],
      ['8000 curtidas', '320.00'],
      ['10000 curtidas', '400.00']
    ]
  },
  {
    id: 'ig_comments',
    label: 'Instagram Comentários',
    emoji: '💬',
    description: 'Comentários personalizados',
    products: [
      ['10 comentários', '6.00'],
      ['30 comentários', '18.00'],
      ['50 comentários', '30.00'],
      ['100 comentários', '60.00'],
      ['200 comentários', '120.00'],
      ['500 comentários', '300.00']
    ]
  },
  {
    id: 'ig_live',
    label: 'Instagram Views Live',
    emoji: '📡',
    description: 'Visualizações em live',
    products: [
      ['100 visualizações', '10.00'],
      ['200 visualizações', '20.00'],
      ['300 visualizações', '30.00'],
      ['500 visualizações', '45.00'],
      ['1000 visualizações', '95.00'],
      ['2000 visualizações', '190.00']
    ]
  },
  {
    id: 'fb_profile',
    label: 'Facebook Perfil Pessoal',
    emoji: '📘',
    description: 'Seguidores para perfil',
    products: [
      ['200 seguidores', '10.00'],
      ['300 seguidores', '15.00'],
      ['400 seguidores', '20.00'],
      ['500 seguidores', '25.00'],
      ['1000 seguidores', '50.00'],
      ['1500 seguidores', '75.00'],
      ['2000 seguidores', '100.00'],
      ['3000 seguidores', '150.00'],
      ['5000 seguidores', '250.00'],
      ['8000 seguidores', '400.00'],
      ['10000 seguidores', '500.00']
    ]
  },
  {
    id: 'yt_subs',
    label: 'YouTube Inscritos',
    emoji: '▶️',
    description: 'Inscritos para YouTube',
    products: [
      ['50 inscritos', '20.00'],
      ['100 inscritos', '40.00'],
      ['150 inscritos', '60.00'],
      ['200 inscritos', '80.00'],
      ['500 inscritos', '180.00'],
      ['1000 inscritos', '340.00']
    ]
  },
  {
    id: 'tt_seg_br',
    label: 'TikTok Seguidores BR',
    emoji: '🎵',
    description: 'Seguidores brasileiros no TikTok',
    products: [
      ['100 seguidores', '5.00'],
      ['200 seguidores', '10.00'],
      ['300 seguidores', '15.00'],
      ['500 seguidores', '25.00'],
      ['1000 seguidores', '50.00'],
      ['1500 seguidores', '75.00'],
      ['2000 seguidores', '100.00']
    ]
  },
  {
    id: 'tt_likes_br',
    label: 'TikTok Curtidas BR',
    emoji: '🔥',
    description: 'Curtidas brasileiras no TikTok',
    products: [
      ['100 curtidas', '4.00'],
      ['300 curtidas', '12.00'],
      ['500 curtidas', '20.00'],
      ['1000 curtidas', '40.00'],
      ['1500 curtidas', '60.00'],
      ['2000 curtidas', '80.00'],
      ['3000 curtidas', '120.00'],
      ['5000 curtidas', '200.00'],
      ['8000 curtidas', '320.00'],
      ['10000 curtidas', '400.00']
    ]
  }
];

function brl(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function isStaff(member) {
  if (!member) return false;
  return (
    member.permissions.has(PermissionsBitField.Flags.Administrator) ||
    member.roles.cache.has(STAFF_ROLE_ID)
  );
}

function makeProductId(categoryId, index) {
  return `${categoryId}_${index}`;
}

function getProductById(productId) {
  for (const category of catalog) {
    for (let i = 0; i < category.products.length; i++) {
      const id = makeProductId(category.id, i);
      if (id === productId) {
        return {
          id,
          categoryId: category.id,
          categoryLabel: category.label,
          categoryEmoji: category.emoji,
          name: category.products[i][0],
          price: category.products[i][1]
        };
      }
    }
  }
  return null;
}

function buildPanelMessages() {
  const rows = [];

  for (const category of catalog) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`store_select_${category.id}`)
      .setPlaceholder(`Selecione um produto • ${category.label}`)
      .addOptions(
        category.products.map((product, index) => ({
          label: product[0].slice(0, 100),
          description: `Valor: ${brl(product[1])}`.slice(0, 100),
          value: makeProductId(category.id, index),
          emoji: category.emoji
        }))
      );

    rows.push(new ActionRowBuilder().addComponents(menu));
  }

  const chunks = [];
  for (let i = 0; i < rows.length; i += 5) {
    chunks.push(rows.slice(i, i + 5));
  }

  return chunks;
}

async function sendStorePanel(channel) {
  const embed = new EmbedBuilder()
    .setTitle('📦 Selecione um produto')
    .setDescription(
      [
        'Escolha um produto nos menus abaixo para abrir seu ticket de compra.',
        '',
        '✅ Inicia em 12 a 24 horas. Se não, em até 48 horas.',
        '✅ Após iniciado, a entrega pode ocorrer de 50 a 250 seguidores por dia.',
        '✅ Público: 100% brasileiros.'
      ].join('\n')
    )
    .setColor(0x8b5cf6)
    .setFooter({ text: 'Angel Store • Sistema de Tickets' });

  const chunks = buildPanelMessages();

  await channel.send({ embeds: [embed] });

  for (const rows of chunks) {
    await channel.send({ components: rows });
  }
}

async function createTicket(interaction, product) {
  const guild = interaction.guild;
  const member = interaction.member;

  const existing = guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildText &&
      c.topic &&
      c.topic.includes(`ticketOwner=${member.id}`)
  );

  if (existing) {
    await interaction.reply({
      content: `Você já possui um ticket aberto: ${existing}`,
      ephemeral: true
    });
    return;
  }

  const channelName = `ticket-${interaction.user.username}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 20);

  const channel = await guild.channels.create({
    name: channelName || `ticket-${interaction.user.id}`,
    type: ChannelType.GuildText,
    parent: TICKET_CATEGORY_ID || null,
    topic: `ticketOwner=${member.id};productId=${product.id};status=aguardando_pagamento`,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionsBitField.Flags.ViewChannel]
      },
      {
        id: member.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory
        ]
      },
      {
        id: STAFF_ROLE_ID,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory,
          PermissionsBitField.Flags.ManageChannels
        ]
      }
    ]
  });

  const embed = new EmbedBuilder()
    .setTitle('🛒 Novo pedido criado')
    .setColor(0x22c55e)
    .setDescription(
      [
        `Olá ${interaction.user}, seu ticket foi criado com sucesso.`,
        '',
        `**Categoria:** ${product.categoryEmoji} ${product.categoryLabel}`,
        `**Produto:** ${product.name}`,
        `**Valor:** ${brl(product.price)}`,
        '',
        `**Chave Pix para pagamento:**`,
        `\`${PIX_KEY || 'CONFIGURE_A_PIX_KEY_NO_ENV'}\``,
        '',
        'Após pagar, clique no botão **Já paguei no Pix**.',
        'Um administrador irá verificar e confirmar o pagamento.'
      ].join('\n')
    )
    .setFooter({ text: 'Angel Store' });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`paid_${product.id}_${interaction.user.id}`)
      .setLabel('Já paguei no Pix')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`close_${interaction.user.id}`)
      .setLabel('Fechar Ticket')
      .setStyle(ButtonStyle.Danger)
  );

  await channel.send({
    content: `${interaction.user} <@&${STAFF_ROLE_ID}>`,
    embeds: [embed],
    components: [row]
  });

  await interaction.reply({
    content: `Seu ticket foi criado: ${channel}`,
    ephemeral: true
  });

  const logChannel = guild.channels.cache.get(LOG_CHANNEL_ID);
  if (logChannel) {
    await logChannel.send(
      `📩 Ticket criado por ${interaction.user.tag} • ${product.categoryLabel} • ${product.name} • ${brl(product.price)}`
    );
  }
}

client.once(Events.ClientReady, () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.content === '!painel') {
    if (!isStaff(message.member)) {
      await message.reply('Apenas admins/equipe podem enviar o painel.');
      return;
    }

    await sendStorePanel(message.channel);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isStringSelectMenu()) {
      const productId = interaction.values[0];
      const product = getProductById(productId);

      if (!product) {
        await interaction.reply({
          content: 'Produto não encontrado.',
          ephemeral: true
        });
        return;
      }

      await createTicket(interaction, product);
      return;
    }

    if (interaction.isButton()) {
      const { customId } = interaction;

      if (customId.startsWith('paid_')) {
        const parts = customId.split('_');
        const buyerId = parts[parts.length - 1];
        const productId = parts.slice(1, -1).join('_');
        const product = getProductById(productId);

        if (interaction.user.id !== buyerId && !isStaff(interaction.member)) {
          await interaction.reply({
            content: 'Somente o cliente deste ticket pode usar este botão.',
            ephemeral: true
          });
          return;
        }

        const confirmRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`confirm_${productId}_${buyerId}`)
            .setLabel('Confirmar pagamento')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`close_${buyerId}`)
            .setLabel('Fechar Ticket')
            .setStyle(ButtonStyle.Danger)
        );

        const embed = new EmbedBuilder()
          .setTitle('💸 Pagamento informado')
          .setColor(0xf59e0b)
          .setDescription(
            [
              `${interaction.user} informou que realizou o pagamento via Pix.`,
              '',
              `**Produto:** ${product ? product.name : 'Produto'}`,
              `**Valor:** ${product ? brl(product.price) : '---'}`,
              '',
              'A equipe deve verificar o pagamento e clicar em **Confirmar pagamento**.'
            ].join('\n')
          );

        await interaction.reply({
          content: 'Aviso enviado para a equipe.',
          ephemeral: true
        });

        await interaction.channel.send({
          content: `<@&${STAFF_ROLE_ID}> verifiquem o pagamento deste pedido.`,
          embeds: [embed],
          components: [confirmRow]
        });

        return;
      }

      if (customId.startsWith('confirm_')) {
        if (!isStaff(interaction.member)) {
          await interaction.reply({
            content: 'Somente admins/equipe podem confirmar pagamento.',
            ephemeral: true
          });
          return;
        }

        const parts = customId.split('_');
        const buyerId = parts[parts.length - 1];
        const productId = parts.slice(1, -1).join('_');
        const product = getProductById(productId);

        const embed = new EmbedBuilder()
          .setTitle('✅ Pagamento confirmado')
          .setColor(0x22c55e)
          .setDescription(
            [
              `Pagamento confirmado por ${interaction.user}.`,
              '',
              `**Cliente:** <@${buyerId}>`,
              `**Produto:** ${product ? product.name : 'Produto'}`,
              `**Valor:** ${product ? brl(product.price) : '---'}`,
              '',
              'A equipe pode seguir com a entrega do pedido.'
            ].join('\n')
          );

        await interaction.reply({
          embeds: [embed]
        });

        const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
        if (logChannel) {
          await logChannel.send(
            `✅ Pagamento confirmado por ${interaction.user.tag} • Cliente <@${buyerId}> • ${product ? product.name : 'Produto'}`
          );
        }

        return;
      }

      if (customId.startsWith('close_')) {
        const ownerId = customId.split('_')[1];

        if (interaction.user.id !== ownerId && !isStaff(interaction.member)) {
          await interaction.reply({
            content: 'Apenas o dono do ticket ou a equipe podem fechar.',
            ephemeral: true
          });
          return;
        }

        await interaction.reply('🔒 Ticket será fechado em 5 segundos...');
        setTimeout(async () => {
          try {
            const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
            if (logChannel) {
              await logChannel.send(
                `🗑️ Ticket ${interaction.channel.name} fechado por ${interaction.user.tag}`
              );
            }

            await interaction.channel.delete();
          } catch (error) {
            console.error('Erro ao fechar ticket:', error);
          }
        }, 5000);

        return;
      }
    }
  } catch (error) {
    console.error(error);

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: 'Ocorreu um erro ao processar essa ação.',
        ephemeral: true
      }).catch(() => {});
    } else {
      await interaction.reply({
        content: 'Ocorreu um erro ao processar essa ação.',
        ephemeral: true
      }).catch(() => {});
    }
  }
});

client.login(process.env.TOKEN);