// Base generic chart data point - just raw data for JSON serialization
export abstract class ChartDataPointDTO {
  key: string;

  constructor(key: string) {
    this.key = key;
  }
}
