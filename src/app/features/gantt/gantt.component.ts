import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttItem } from '../../types/gnatt-item';

@Component({
  selector: 'app-gantt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gantt.component.html',
})
export class GanttComponent {
  public days = computed<Date[]>(() => {
    const items: GanttItem[] = this.tasks();
    if (items.length === 0) {
      return [];
    }

    const minDate: Date = this.findMinStartDate(items);
    const maxDate: Date = this.findMaxEndDate(items);
    return this.buildDateRange(minDate, maxDate);
  });

  // Generated mock
  public tasks = signal<GanttItem[]>([
    { id: 1, title: 'Discovery', start: '2025-09-01', end: '2025-09-03' },
    { id: 2, title: 'Requirements', start: '2025-09-02', end: '2025-09-06' },
    { id: 3, title: 'Design', start: '2025-09-04', end: '2025-09-10' },
    { id: 4, title: 'API Contract', start: '2025-09-05', end: '2025-09-07' },
    { id: 5, title: 'Frontend Setup', start: '2025-09-06', end: '2025-09-09' },
    { id: 6, title: 'Backend Setup', start: '2025-09-07', end: '2025-09-12' },
    { id: 7, title: 'Integration', start: '2025-09-10', end: '2025-09-15' },
    { id: 8, title: 'E2E Tests', start: '2025-09-12', end: '2025-09-16' },
    { id: 9, title: 'UAT', start: '2025-09-14', end: '2025-09-18' },
    { id: 10, title: 'Release Prep', start: '2025-09-17', end: '2025-09-20' },
  ]);

  public isDayInTask(currentDay: Date, task: GanttItem): boolean {
    const startDate: Date = new Date(task.start);
    const endDate: Date = new Date(task.end);
    return currentDay >= startDate && currentDay <= endDate;
  }

  private diffInDays(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  }

  private findMinStartDate(items: GanttItem[]): Date {
    let min: Date | null = null;

    for (const item of items) {
      const start: Date = new Date(item.start);

      if (min === null || start < min) {
        min = start;
      }
    }

    return min as Date;
  }

  private findMaxEndDate(items: GanttItem[]): Date {
    let max: Date | null = null;

    for (const item of items) {
      const end: Date = new Date(item.end);

      if (max === null || end > max) {
        max = end;
      }
    }

    return max as Date;
  }

  private buildDateRange(start: Date, end: Date): Date[] {
    const result: Date[] = [];
    const totalDays: number = this.diffInDays(start, end) + 1;

    for (let offset = 0; offset < totalDays; offset++) {
      const next: Date = new Date(start);

      next.setDate(start.getDate() + offset);
      result.push(next);
    }

    return result;
  }
}
