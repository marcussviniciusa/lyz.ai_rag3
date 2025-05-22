const PDFDocument = require('pdfkit');
const logger = require('../utils/logger');

/**
 * Serviço para geração de arquivos PDF a partir dos planos de saúde
 */
class PDFService {
  /**
   * Gera um PDF a partir de um plano finalizado
   * @param {Object} plan - Plano completo com dados da paciente e recomendações
   * @returns {Promise<Buffer>} Buffer contendo o PDF gerado
   */
  async generatePlanPDF(plan) {
    return new Promise((resolve, reject) => {
      try {
        // Verificar se o plano está finalizado
        if (plan.status !== 'completed' || !plan.final_plan || !plan.final_plan.content) {
          throw new Error('Não é possível gerar PDF para um plano não finalizado');
        }
        
        const chunks = [];
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          info: {
            Title: plan.title,
            Author: 'Sistema Lyz',
            Subject: 'Plano de Saúde Feminina Personalizado',
            Keywords: 'saúde feminina, plano personalizado, ciclicidade',
            CreationDate: new Date()
          }
        });
        
        // Coletar chunks do PDF
        doc.on('data', chunk => chunks.push(chunk));
        
        // Resolver a Promise quando o PDF estiver completo
        doc.on('end', () => {
          const result = Buffer.concat(chunks);
          resolve(result);
        });
        
        // Iniciar geração do PDF
        this.generatePDFContent(doc, plan);
        
        // Finalizar documento
        doc.end();
      } catch (error) {
        logger.error('Erro ao gerar PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Gera o conteúdo do PDF com layout personalizado
   * @param {PDFDocument} doc - Documento PDF
   * @param {Object} plan - Plano completo
   */
  generatePDFContent(doc, plan) {
    const primaryColor = '#9C27B0';
    const secondaryColor = '#FF4081';
    const textColor = '#424242';
    const lightGray = '#f8f8f8';
    
    // Configurações de fonte
    doc.registerFont('Heading', 'Helvetica-Bold');
    doc.registerFont('Regular', 'Helvetica');
    doc.registerFont('Italic', 'Helvetica-Oblique');
    
    // Cabeçalho
    this.addHeader(doc, plan, primaryColor);
    
    // Dados da paciente
    this.addPatientInfo(doc, plan, primaryColor, lightGray);
    
    // Conteúdo principal - o plano gerado
    this.addPlanContent(doc, plan, primaryColor, secondaryColor, textColor);
    
    // Rodapé em cada página
    this.addFooter(doc, primaryColor);
  }

  /**
   * Adiciona o cabeçalho ao PDF
   * @param {PDFDocument} doc - Documento PDF
   * @param {Object} plan - Plano completo
   * @param {string} primaryColor - Cor primária
   */
  addHeader(doc, plan, primaryColor) {
    // Linha superior colorida
    doc.rect(0, 0, doc.page.width, 15)
      .fill(primaryColor);
    
    // Logo e título
    doc.fontSize(24)
      .font('Heading')
      .fillColor(primaryColor)
      .text('LYZ', 50, 40, { align: 'left' });
    
    doc.fontSize(12)
      .font('Regular')
      .fillColor('#666666')
      .text('Plano de Saúde Feminina Personalizado', 50, 70, { align: 'left' });
    
    // Data de geração
    const dateStr = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    doc.fontSize(10)
      .text(`Gerado em: ${dateStr}`, 50, 90, { align: 'left' });
    
    doc.moveDown(2);
  }

  /**
   * Adiciona informações da paciente
   * @param {PDFDocument} doc - Documento PDF
   * @param {Object} plan - Plano completo
   * @param {string} primaryColor - Cor primária
   * @param {string} lightGray - Cor de fundo claro
   */
  addPatientInfo(doc, plan, primaryColor, lightGray) {
    const startY = doc.y;
    
    // Título da seção
    doc.fontSize(16)
      .font('Heading')
      .fillColor(primaryColor)
      .text('INFORMAÇÕES DA PACIENTE', { underline: true });
    
    doc.moveDown(0.5);
    
    // Box de informações
    const boxStartY = doc.y;
    doc.rect(50, boxStartY, doc.page.width - 100, 100)
      .fillAndStroke(lightGray, '#dddddd');
    
    doc.fontSize(12)
      .font('Regular')
      .fillColor('#333333');
    
    // Coluna 1
    doc.text(`Nome: ${plan.patient.name || 'Não informado'}`, 70, boxStartY + 15);
    doc.text(`Idade: ${plan.patient.age || 'Não informado'}`, 70, boxStartY + 35);
    
    // Coluna 2
    const colWidth = (doc.page.width - 120) / 2;
    doc.text(`Altura: ${plan.patient.height ? `${plan.patient.height} cm` : 'Não informado'}`, 70 + colWidth, boxStartY + 15);
    doc.text(`Peso: ${plan.patient.weight ? `${plan.patient.weight} kg` : 'Não informado'}`, 70 + colWidth, boxStartY + 35);
    
    // Sintomas principais
    doc.text('Sintomas principais:', 70, boxStartY + 60);
    
    if (plan.symptoms && plan.symptoms.length > 0) {
      const symptomsText = plan.symptoms
        .slice(0, 3) // Limitamos a 3 sintomas no resumo
        .map((s, index) => `${index + 1}. ${s.description}`)
        .join('; ');
      
      doc.font('Italic')
        .text(symptomsText, 190, boxStartY + 60, { width: doc.page.width - 260 });
    } else {
      doc.font('Italic')
        .text('Não informados', 190, boxStartY + 60);
    }
    
    doc.moveDown(3);
  }

  /**
   * Adiciona o conteúdo principal do plano
   * @param {PDFDocument} doc - Documento PDF
   * @param {Object} plan - Plano completo
   * @param {string} primaryColor - Cor primária
   * @param {string} secondaryColor - Cor secundária
   * @param {string} textColor - Cor do texto
   */
  addPlanContent(doc, plan, primaryColor, secondaryColor, textColor) {
    // Título principal do plano
    doc.fontSize(18)
      .font('Heading')
      .fillColor(primaryColor)
      .text(plan.title, { align: 'center' });
    
    doc.moveDown(1);
    
    // Inserir o conteúdo do plano final, formatando seções
    const content = plan.final_plan.content;
    
    // Dividir por seções usando expressões regulares
    const sections = this.extractSections(content);
    
    // Processar cada seção
    sections.forEach(section => {
      if (section.title) {
        // Adicionar uma quebra de página se necessário
        if (doc.y > doc.page.height - 150) {
          doc.addPage();
        }
        
        // Título da seção
        doc.fontSize(14)
          .font('Heading')
          .fillColor(secondaryColor)
          .text(section.title.toUpperCase(), { underline: true });
        
        doc.moveDown(0.5);
      }
      
      if (section.content) {
        // Verificar e processar subseções (marcadas com negrito ou sublinhado)
        const contentParts = this.processSubsections(section.content);
        
        contentParts.forEach(part => {
          if (part.isSubheading) {
            doc.fontSize(12)
              .font('Heading')
              .fillColor(textColor)
              .text(part.text);
            
            doc.moveDown(0.3);
          } else {
            doc.fontSize(11)
              .font('Regular')
              .fillColor(textColor)
              .text(part.text, {
                align: 'justify',
                paragraphGap: 5
              });
            
            doc.moveDown(0.5);
          }
        });
      }
      
      doc.moveDown(1);
    });
  }

  /**
   * Extrai seções do conteúdo do plano
   * @param {string} content - Conteúdo do plano
   * @returns {Array} Lista de seções com título e conteúdo
   */
  extractSections(content) {
    const sectionRegex = /(?:\n|^)(\d+\. [^\n]+)\n/g;
    const sections = [];
    let lastIndex = 0;
    let match;
    
    while ((match = sectionRegex.exec(content)) !== null) {
      // Índice do início do título da seção
      const titleStart = match.index;
      
      // Se não é a primeira seção, adicionar o conteúdo da seção anterior
      if (titleStart > 0 && sections.length > 0) {
        sections[sections.length - 1].content = content.slice(lastIndex, titleStart).trim();
      }
      
      // Adicionar nova seção
      sections.push({
        title: match[1],
        content: ''
      });
      
      // Atualizar índice para a próxima busca
      lastIndex = match.index + match[0].length;
    }
    
    // Adicionar o conteúdo da última seção
    if (sections.length > 0) {
      sections[sections.length - 1].content = content.slice(lastIndex).trim();
    } else {
      // Se nenhuma seção foi encontrada, adicionar todo o conteúdo
      sections.push({
        title: '',
        content: content.trim()
      });
    }
    
    return sections;
  }

  /**
   * Processa subseções dentro do conteúdo
   * @param {string} content - Conteúdo da seção
   * @returns {Array} Lista de partes com formato
   */
  processSubsections(content) {
    // Dividir por linhas
    const lines = content.split('\n');
    const parts = [];
    let currentParagraph = '';
    
    lines.forEach(line => {
      // Verificar se a linha parece um subtítulo
      const trimmedLine = line.trim();
      const isSubheading = (
        // Subseções começando com hífen ou bullet
        /^[\-\•\*]\s+[A-Z]/.test(trimmedLine) ||
        // Ou com formato de lista numerada
        /^\d+\.\s+[A-Z]/.test(trimmedLine) ||
        // Ou texto em CAPS com menos de 50 caracteres
        (trimmedLine.toUpperCase() === trimmedLine && trimmedLine.length > 3 && trimmedLine.length < 50)
      );
      
      if (isSubheading) {
        // Adicionar parágrafo atual se existir
        if (currentParagraph.trim()) {
          parts.push({
            isSubheading: false,
            text: currentParagraph.trim()
          });
          currentParagraph = '';
        }
        
        // Adicionar subtítulo
        parts.push({
          isSubheading: true,
          text: trimmedLine
        });
      } else if (trimmedLine) {
        // Se não for linha vazia, adicionar ao parágrafo atual
        currentParagraph += (currentParagraph ? ' ' : '') + trimmedLine;
      } else {
        // Linha vazia - finalizar parágrafo atual se existir
        if (currentParagraph.trim()) {
          parts.push({
            isSubheading: false,
            text: currentParagraph.trim()
          });
          currentParagraph = '';
        }
      }
    });
    
    // Adicionar último parágrafo se existir
    if (currentParagraph.trim()) {
      parts.push({
        isSubheading: false,
        text: currentParagraph.trim()
      });
    }
    
    return parts;
  }

  /**
   * Adiciona rodapé a todas as páginas
   * @param {PDFDocument} doc - Documento PDF
   * @param {string} primaryColor - Cor primária
   */
  addFooter(doc, primaryColor) {
    const pages = doc.bufferedPageRange().count;
    for (let i = 0; i < pages; i++) {
      doc.switchToPage(i);
      
      // Linha inferior
      doc.rect(0, doc.page.height - 30, doc.page.width, 15)
        .fill(primaryColor);
      
      // Texto do rodapé
      doc.fontSize(8)
        .font('Regular')
        .fillColor('#666666')
        .text(
          'Sistema Lyz - Planos Personalizados com Base na Ciclicidade Feminina',
          50,
          doc.page.height - 25,
          { align: 'center' }
        );
      
      // Numeração de página
      doc.text(
        `Página ${i + 1} de ${pages}`,
        50,
        doc.page.height - 40,
        { align: 'right' }
      );
    }
  }
}

// Exportar instância única do serviço
module.exports = new PDFService();
