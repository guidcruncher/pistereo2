export class Uri {
  source: string = ''
  type: string = ''
  id: string = ''
  uri: string = ''

  public toString(): string {
    return `${this.source}:${this.type}:${this.id}`
  }

  static fromUriString(uri: any) {
    let result = new Uri()
    if (uri.source && uri.type && uri.id) {
      result = uri as Uri
    } else {
      if (typeof uri === 'string') {
        let parts = uri.split(':')

        if (parts.length != 3) {
          throw new Error('Invalid uri structure')
        }
        result.uri = uri
        result.source = parts[0]
        result.type = parts[1]
        result.id = parts[2]
      } else {
        if (uri instanceof Uri) {
          result = uri as Uri
        } else {
          throw new Error('Invalid uri type, expected string or Uri.')
        }
      }
    }

    return result
  }
}
