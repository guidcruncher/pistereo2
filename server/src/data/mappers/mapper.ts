export type Mapper<TOut> = (input: any) => TOut

export const imageUrl = (images: any[]) => {
  if (images) {
    if (images.length > 0) {
      const h = images
        .map((i) => {
          return i.height
        })
        .sort()
        .pop()
      return images.find((i) => {
        return i.height == h
      }).url
    }
  }
  return ''
}
