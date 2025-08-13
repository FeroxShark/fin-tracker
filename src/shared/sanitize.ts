export function sanitizeText(input: string): string {
  // Replace control chars (0x00-0x1F, 0x7F) without using regex ranges flagged by no-control-regex
  let out = ''
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i)
    if ((code >= 0 && code <= 31) || code === 127) {
      out += ' '
    } else {
      out += input[i]
    }
  }
  return out.replace(/[<>]/g, '').trim()
}


