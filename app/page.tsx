import { alexBrush } from './layout'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center p-8 max-w-5xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="text-maroon block mb-4">Hello, World!</span>
          <span className="text-teal block mb-4">This is</span>
          <span className={`${alexBrush.className} text-burgundy block text-7xl md:text-9xl my-8`}>
            Akshay Malhotra
          </span>
          <span className="text-gold block mt-4">, for the 2nd time!</span>
        </h1>
      </div>
    </div>
  )
}
