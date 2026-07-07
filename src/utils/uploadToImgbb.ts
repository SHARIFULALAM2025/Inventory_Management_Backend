import axios from 'axios'
import FormData from 'form-data'
import ApiError from './apiError'

export const uploadToImgbb = async (fileBuffer: Buffer): Promise<string> => {
  try {
    const apiKey = process.env.IMGBB_API_KEY as string

    if (!apiKey) {
      throw new ApiError(500, 'IMGBB_API_KEY is not configured')
    }

    const formData = new FormData()
    formData.append('image', fileBuffer.toString('base64'))

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    )

    const imageUrl = response.data?.data?.url

    if (!imageUrl) {
      throw new ApiError(500, 'Image upload failed, no URL returned')
    }

    return imageUrl
  } catch (error: any) {
    throw new ApiError(500, `Image upload failed: ${error.message}`)
  }
}
