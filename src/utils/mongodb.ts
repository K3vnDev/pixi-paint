import mongoose from 'mongoose'

const { DB_URI } = process.env

if (!DB_URI) {
  throw new Error('No DB_URI was found in .env.local')
}

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export const mongodb = async () => {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(DB_URI!, { bufferCommands: false }).then(m => m)
  }
  cached.conn = await cached.promise

  return cached.conn
}
