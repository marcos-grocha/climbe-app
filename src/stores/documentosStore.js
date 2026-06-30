import { defineStore } from 'pinia'
import {
  listarDocumentos,
  enviarDocumento as enviarDocumentoService,
  excluirDocumento as excluirDocumentoService,
  aprovarDocumento as aprovarDocumentoService,
  rejeitarDocumento as rejeitarDocumentoService,
} from '@/services/documentosService'

export const useDocumentosStore = defineStore('documentos', {
  state: () => ({
    documentos: [],
    carregando: false,
  }),
  actions: {
    async carregarDocumentos() {
      this.carregando = true
      try {
        const dados = await listarDocumentos()
        this.documentos = dados
        return dados
      } finally {
        this.carregando = false
      }
    },
    async enviarDocumento(payload) {
      const novoDocumento = await enviarDocumentoService(payload)
      this.documentos.push(novoDocumento)
      return novoDocumento
    },
    async excluirDocumento(id) {
      await excluirDocumentoService(id)
      this.documentos = this.documentos.filter((doc) => doc.id !== id)
    },
    async aprovarDocumento(id, observacao = '') {
      const docAprovado = await aprovarDocumentoService(id, observacao)
      this.documentos = this.documentos.map((doc) =>
        doc.id === id ? docAprovado : doc,
      )
      return docAprovado
    },
    async rejeitarDocumento(id, motivo) {
      const docRejeitado = await rejeitarDocumentoService(id, motivo)
      this.documentos = this.documentos.map((doc) =>
        doc.id === id ? docRejeitado : doc,
      )
      return docRejeitado
    },
  },
})
