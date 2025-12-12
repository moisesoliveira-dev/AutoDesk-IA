import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Ticket } from '../../types';

// Register font (optional, using standard Helvetica here for simplicity/compatibility)
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff' });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333'
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a', // blue-900
    marginBottom: 5
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b'
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    fontWeight: 'bold',
    color: '#475569'
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5
  },
  colId: { width: '10%' },
  colTitle: { width: '35%' },
  colSector: { width: '15%' },
  colStatus: { width: '15%' },
  colDate: { width: '15%' },
  colRating: { width: '10%' },
  
  statusResolved: { color: '#16a34a' },
  statusOpen: { color: '#2563eb' },
  
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10
  }
});

interface ReportDocumentProps {
  tickets: Ticket[];
  filterDescription: string;
}

const ReportDocument: React.FC<ReportDocumentProps> = ({ tickets, filterDescription }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatório de Atendimentos - AutoDesk AI</Text>
        <Text style={styles.subtitle}>{filterDescription}</Text>
        <Text style={styles.subtitle}>Gerado em: {new Date().toLocaleString('pt-BR')}</Text>
      </View>

      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, styles.colId]}><Text>ID</Text></View>
          <View style={[styles.tableCol, styles.colTitle]}><Text>Título</Text></View>
          <View style={[styles.tableCol, styles.colSector]}><Text>Setor</Text></View>
          <View style={[styles.tableCol, styles.colStatus]}><Text>Status</Text></View>
          <View style={[styles.tableCol, styles.colDate]}><Text>Data</Text></View>
          <View style={[styles.tableCol, styles.colRating]}><Text>Nota</Text></View>
        </View>

        {/* Rows */}
        {tickets.map(t => (
          <View style={styles.tableRow} key={t.id}>
            <View style={[styles.tableCol, styles.colId]}><Text>{t.id}</Text></View>
            <View style={[styles.tableCol, styles.colTitle]}><Text>{t.title}</Text></View>
            <View style={[styles.tableCol, styles.colSector]}><Text>{t.assignedSector}</Text></View>
            <View style={[styles.tableCol, styles.colStatus]}>
              <Text style={t.status === 'Resolvido' ? styles.statusResolved : styles.statusOpen}>
                {t.status}
              </Text>
            </View>
            <View style={[styles.tableCol, styles.colDate]}><Text>{new Date(t.createdAt).toLocaleDateString()}</Text></View>
            <View style={[styles.tableCol, styles.colRating]}><Text>{t.rating ? `${t.rating}.0` : '-'}</Text></View>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Resumo:</Text>
          <Text>Total de Chamados: {tickets.length}</Text>
          <Text>Média de Satisfação: {(tickets.reduce((acc, t) => acc + (t.rating || 0), 0) / (tickets.filter(t => t.rating).length || 1)).toFixed(1)}/5.0</Text>
      </View>

      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Página ${pageNumber} de ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export default ReportDocument;