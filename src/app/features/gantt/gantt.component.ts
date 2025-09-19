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
  public days = computed<number[]>(() =>  [...Array(31)].map((_, i) => i + 1));

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

  public isDayInTask(day: number, task: GanttItem): boolean {
    const startDay = this.getDayOfMonth(task.start);
    const endDay = this.getDayOfMonth(task.end);
    return day >= startDay && day <= endDay;
  }

  private getDayOfMonth(date: string): number {
    return new Date(date).getDate();
  }
}
