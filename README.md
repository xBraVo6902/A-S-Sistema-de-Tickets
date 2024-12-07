# TODO

Los puntos marcados con `!` son urgentes (próximo sprint), mientras que los marcados con `?` son opcionales (aunque deberían implementarse).

- `!` En la vista de ticket por parte del usuario, aún no se puede cambiar el estado del ticket.
- `!` No se por qué las rutas están en inglés pero deberían estar en español.
- `?` ~Cuando carga alguna página que requiere de datos antes de mostrar la interfaz, simplemente aparece un mensaje diciendo Loading.... Debería cambiarse a un spinner o un esqueleto (ojalá).~ (Está implementado sólo en algunas partes)

# Configuración

## Instalar dependencias

Una vez clonado el repositorio, instalar las dependencias con el siguiente comando:

```bash
npm install
```

## Base de datos

El proyecto usa [MariaDB](https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.5.2&os=windows&cpu=x86_64&pkg=msi&mirror=insacom) como su base de datos. Al instalar MariaDB, recordar la contraseña y el puerto. En mi caso son `12345` y `3307` respectivamente.

Abrir HeidiSQL y crear una nueva base de datos con el nombre `tickets_system`.

## Variables de entorno

En el root del proyecto hay un archivo `.env.example` con el siguiente contenido:

```env
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=openssl rand -base64 32
```

Reemplazar los respectivos campos de `DATABASE_URL`. En mi caso, se ve así:

```
DATABASE_URL=mysql://root:12345@localhost:3307/tickets_system
```

Para el valor de `NEXTAUTH_SECRET`, entrar a [CrypTool](https://www.cryptool.org/en/cto/openssl/) y copiar el comando:

```bash
openssl rand -base64 32
```

Debería verse algo como esto:

```
saY7kl76gVM1lAdemR0Pn2ctN1QksDrcUTbhoyz6MNs=
```

Finalmente, cambiar el nombre del archivo de `.env.example` a `.env`. El archivo debería quedar finalmente algo así:

```env
DATABASE_URL=mysql://root:12345@localhost:3307/tickets_system
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=saY7kl76gVM1lAdemR0Pn2ctN1QksDrcUTbhoyz6MNs=
```

## Poblar base de datos

Correr el siguiente comando:

```
npx prisma migrate dev --name init
```

Luego, correr este otro comando:

```
npm run seed
```

Eso es todo, para ver los datos puedes usar HeidiSQL o el CLI de MariaDB.

## Iniciar servidor

Para iniciar el server, correr el comando:

```
npm run dev
```

Para entrar a la página, ingresar a [http://localhost:3000/](http://localhost:3000/). Para iniciar sesión, puedes usar alguno de los datos en el archivo `@/prisma/data.js`.

# Información

## Rutas

Las rutas en [Next.js](https://nextjs.org/docs) se administran mediante la jerarquía de archivos. Por ejemplo, para crear la ruta `localhost:3000/tickets/create` debe existir el archivo `@/app/tickets/create/page.tsx`. Más información en este [enlace](https://nextjs.org/docs/app/building-your-application/routing/defining-routes).

## API

Los endpoints de la API funcionan de manera similar al router, pero el archivo debe llamarse `route.tsx` en vez de `page.tsx`. Más informacion en este [enlace](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).

## shadcn/ui

El proyecto ocupa una librería de componentes personalizables llamada [shadcn/ui](https://ui.shadcn.com/docs/components/accordion). Para usar un componente simplemente hay que importarlo. En caso de que no exista hay que añadirlo con el CLI. Por ejemplo, el siguiente comando añade el componente `accordion`:

```
npx shadcn@latest add accordion
```

## Tailwind CSS

Los componentes proveen una buena base para crear páginas bonitas, pero si se quieren personalizar aún más, solo hay que usar [Tailwind CSS](https://tailwindcss.com/docs/aspect-ratio). Por ejemplo, para editar un elemento `p` con texto rojo, se puede usar algo como esto:

```html
<p className="text-500">Hola Mundo!</p>
```
