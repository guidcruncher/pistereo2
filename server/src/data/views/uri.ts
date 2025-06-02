export class Uri {
  source = ''

  type = ''

  id = ''

  uri = ''

  toString(): string {
    return `${this.source}:${this.type}:${this.id}`
  }

  static fromUriString(uri: any) {
    let result = new Uri()
    if (!uri) {
      return result
    }

    if (uri.source && uri.type && uri.id) {
      result = uri as Uri
    } else {
      if (typeof uri === 'string') {
        const parts = uri.split(':')

        if (parts.length != 3) {
          throw new Error('Invalid uri structure')
        }
        result.source = parts[0]
        result.type = parts[1]
        result.id = parts[2]
        result.uri = uri
      } else {
        if (uri instanceof Uri) {
          result = uri
        } else {
          throw new Error('Invalid uri type, expected string or Uri.')
        }
      }
    }

    return result
  }
}
