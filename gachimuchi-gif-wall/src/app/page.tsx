export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Welcome to Gachimuchi GIF Wall
        </h2>
        <p className="text-gray-300 text-lg">
          An infinite scrolling collection of GIFs powered by Tenor API
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Project Setup Complete</h3>
        <p className="text-gray-300 mb-4">
          The basic project structure has been established with:
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Next.js 15.5.4 with TypeScript</li>
          <li>Tailwind CSS 4.0 for styling</li>
          <li>Dark theme layout</li>
          <li>ESLint and Prettier configuration</li>
          <li>Vercel deployment setup</li>
          <li>Organized directory structure</li>
        </ul>
      </div>
    </div>
  );
}
