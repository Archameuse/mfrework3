import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

export default NextAuth({
  secret: process.env.SECRET,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
    }),
  ],
})