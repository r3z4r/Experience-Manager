import { NextResponse } from 'next/server'
import { createImage } from '@/app/(frontend)/_actions/images'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('Received upload request:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      category,
    })

    const image = await createImage(file, category)
    console.log('Upload successful:', image)
    return NextResponse.json(image)
  } catch (error) {
    console.error('Upload error details:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
