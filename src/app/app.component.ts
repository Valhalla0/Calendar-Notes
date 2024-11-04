import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { MenuItem } from 'primeng/api';
import { DockModule } from 'primeng/dock';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FloatLabelModule } from 'primeng/floatlabel';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import { RouterOutlet } from '@angular/router';


interface Note {
  [category: string]: string; // Notes for each category
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, FormsModule, FullCalendarModule, ButtonModule, CalendarModule, DockModule, RadioButtonModule, FloatLabelModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
  
})
export class AppComponent implements OnInit {
  events: Array<any> = []; // Stores events for the calendar
  categories: Array<string> = ['Work', 'Personal', 'Health']; // Default categories
  newCategory: string = ''; // For adding new category
  selectedDate: string = ''; // Date selected on the calendar
  notes: Record<string, Note> = {}; // Stores notes based on date and category
  date: Date = new Date();
  calendarOptions: any; // Options for FullCalendar
  noteForm: { [date: string]: { [category: string]: FormControl } } = {}; // FormControl for notes
  theme: 'light' | 'dark' = 'light'; // Initialize to 'light' theme
//DOCK
  items: MenuItem[] = [];
  position: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
  positionOptions = [
      {
          label: 'Bottom',
          value: 'bottom'
      },
      {
          label: 'Top',
          value: 'top'
      },
      {
          label: 'Left',
          value: 'left'
      },
      {
          label: 'Right',
          value: 'right'
      }
  ];

  constructor(private renderer: Renderer2){
    
  }

  ngOnInit(): void {
    this.initializeCalendar();
    this.items = [
      {
          label: 'Calendar',
          icon: 'pi pi-calendar'
      },
      {
          label: 'Reminders',
          icon: 'pi pi-bell'
      },
      {
          label: 'All',
          icon: 'pi pi-book'
      },
      {
          label: 'Trash',
          icon: 'pi pi-trash'
      }
  ];
  }
  loadTheme(): void {
    const themePath =
      this.theme === 'light'
        ? 'assets/themes/primeone-light.scss'
        : 'assets/themes/primeone-dark.scss';

    // Remove existing theme if any
    const existingLink = document.getElementById('theme-link');
    if (existingLink) {
      existingLink.remove();
    }

    // Dynamically add the theme
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.id = 'theme-link';
    link.href = themePath;
    this.renderer.appendChild(document.head, link);
  }
  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.loadTheme();
  }
  initializeCalendar(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      dateClick: this.handleDateClick.bind(this),
      editable: true,
      selectable: true,
      events: this.events,
    };
  }

  handleDateClick(arg: { dateStr: string }): void {
    this.selectedDate = arg.dateStr;

    if (!this.notes[this.selectedDate]) {
      this.notes[this.selectedDate] = {};
      this.noteForm[this.selectedDate] = {}; // Initialize form for selected date

      // Initialize FormControls for each category
      this.categories.forEach(category => {
        this.notes[this.selectedDate][category] = ''; // Initialize empty notes for each category
        this.noteForm[this.selectedDate][category] = new FormControl(''); // Create a new FormControl
      });
    }
  }

  addCategory(): void {
    if (this.newCategory && !this.categories.includes(this.newCategory)) {
      this.categories.push(this.newCategory);
      this.newCategory = '';
    }
  }

  saveNote(): void {
    // Save notes logic can be enhanced to persist on localStorage or backend
    const currentNotes = this.noteForm[this.selectedDate];
    Object.keys(currentNotes).forEach(category => {
      this.notes[this.selectedDate][category] = currentNotes[category].value; // Assign FormControl value to notes
    });

    console.log('Notes saved for:', this.selectedDate, this.notes[this.selectedDate]);
  }
  applyTheme(): void {
     if (this.theme) {
      // Adjust for dark mode
      document.documentElement.style.setProperty('--background-color', '#2b2b2b');
      document.documentElement.style.setProperty('--text-color1', '#f0f0f0');
      document.documentElement.style.setProperty('--brightness-filter', '1.4'); // Lighter shade for dark mode
    } else {
      // Adjust for light mode
      document.documentElement.style.setProperty('--background-color', '#ffffff');
      document.documentElement.style.setProperty('--text-color1', '#f0f0f0');
      document.documentElement.style.setProperty('--brightness-filter', '0.85'); // Darker shade for light mode
    }
  }
  
}