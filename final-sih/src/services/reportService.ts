import { REPORTS_DATA } from '../data/reports';
import { ReportItem } from '../types';

export const reportService = {
  getAllReports(): ReportItem[] {
    return REPORTS_DATA;
  },

  getReportById(id: string): ReportItem | undefined {
    return REPORTS_DATA.find(r => r.id === id);
  },

  generateReport(params: {
    title: string;
    type: ReportItem['type'];
    state: string;
    district?: string;
    project?: string;
    author: string;
  }): ReportItem {
    const newReport: ReportItem = {
      id: `REP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: params.title,
      type: params.type,
      generatedDate: new Date().toISOString().split('T')[0],
      state: params.state,
      district: params.district,
      project: params.project,
      riskLevel: 'HIGH',
      author: params.author,
      format: 'PDF',
      fileSize: '3.4 MB',
    };
    REPORTS_DATA.unshift(newReport);
    return newReport;
  },

  downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(cell => `"${cell}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
