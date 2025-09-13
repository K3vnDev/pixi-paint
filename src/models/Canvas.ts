import { CANVAS_RESOLUTION } from '@consts'
import { model, models, Schema } from 'mongoose'

const pixelsMaxValue = CANVAS_RESOLUTION ** 2 - 1

const schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  pixels: {
    type: Map,
    of: {
      type: [Number],
      validate: {
        validator: (arr: number[]) => arr.every(num => num >= 0 && num <= pixelsMaxValue),
        message: `Pixel values must be between 0 and ${pixelsMaxValue}`
      }
    },
    required: true
  },
  bg: {
    type: String,
    required: true
  }
})

export const CanvasModel = models.CanvasModel || model('CanvasModel', schema)
