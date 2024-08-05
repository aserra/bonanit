# Buenas Noches _baby_

* Utilizando el [Nuxt OpenAI Starter](https://github.com/vercel/ai/tree/main/examples/nuxt-openai)
* Creado inicialmente para la presentación del [Hackaton Vercel 2024](https://github.com/midudev/hackaton-vercel-2024)
* Desplegado en: [Buenas Noches _baby_](https://buenasnoches.baby)

## Desarrollo

Para ejecutar el proyecto localmente necesitas:
1. Clonar el repositorio.
2. Registrarte en la [Plataforma de Desarrolladores de OpenAI](https://platform.openai.com/signup).
3. Ir al [tablero de OpenAI](https://platform.openai.com/account/api-keys) y crear una CLAVE API.
4. Configurar la variable de entorno requerida por OpenAI con el valor del token como se muestra en [el archivo de ejemplo env](./.env.example), pero en un nuevo archivo llamado `.env`.
5. Ejecutar `pnpm install` para instalar las dependencias necesarias.
6. Ejecutar `pnpm dev` para lanzar el servidor de desarrollo.

## Desplegar en Vercel

Este ejemplo se puede desplegar directamente en Vercel. Puedes ejecutar los siguientes comandos:

```bash
pnpm run build
vercel deploy
```

Está configurado para usar el `vercel-edge` [[Nitro preset](https://nitro.unjs.io/deploy/providers/vercel#vercel-edge-functions).
Esto significa que el ejemplo se desplegará en la Red Edge de Vercel.
Puedes utilizar diferentes proveedores, como `vercel`, modificando tu archivo `nuxt.config.ts` o utilizando la variable de entorno `NITRO_PRESET`.

## Aprender Más

Para aprender más sobre OpenAI, Nuxt y el SDK de Vercel AI, consulta los siguientes recursos:

- [Documentación del SDK de Vercel AI](https://sdk.vercel.ai/docs) - aprende más sobre el SDK de Vercel AI.
- [Vercel AI Playground](https://play.vercel.ai) - compara y ajusta más de 20 modelos de IA lado a lado.
- [Documentación de OpenAI](https://platform.openai.com/docs) - aprende sobre las características y API de OpenAI.
- [Documentación de Nuxt](https://nuxt.com/docs) - aprende sobre las características y API de Nuxt.
