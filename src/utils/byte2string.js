import prettyBytes from 'pretty-bytes'

export function byte2string(num) {
    return prettyBytes(num, { bits: false, binary: true, space: false, maximumFractionDigits: 2 }).padStart(9, ' ')
}
