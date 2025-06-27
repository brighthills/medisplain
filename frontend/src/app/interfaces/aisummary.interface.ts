export interface AISummary {
  shortExplanation: string;
  keyFindings: string;
  detailedExplanation: string;
  doctorRecommendation: string;
}

export interface AISummaryResponse {
  success: boolean;
  resultMessage: string | null;
  detailedResult: AISummary;
}