export function apenasNumeros(valor) {
  return String(valor || '').replace(/\D/g, '')
}

export function validarCnpj(cnpj) {
  const valor = apenasNumeros(cnpj)
  if (valor.length !== 14) return false
  if (/^(\d)\1+$/.test(valor)) return false

  const calcularDigito = (base, pesos) => {
    const soma = base
      .split('')
      .reduce((acumulador, numero, indice) => acumulador + Number(numero) * pesos[indice], 0)
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  const base = valor.slice(0, 12)
  const digito1 = calcularDigito(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const digito2 = calcularDigito(`${base}${digito1}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])

  return valor === `${base}${digito1}${digito2}`
}

export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}
