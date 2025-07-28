// Student Performance Tracker Application
class StudentTracker {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.grades = JSON.parse(localStorage.getItem('grades')) || [];
        this.currentEditingStudent = null;
        this.currentEditingGrade = null;
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.updateHeaderStats();
        this.renderDashboard();
        this.renderStudents();
        this.renderGrades();
        this.renderAnalytics();
        
        // Set today's date as default for grade form
        document.getElementById('grade-date').valueAsDate = new Date();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Modal controls
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal || e.target.closest('[data-modal]').dataset.modal;
                this.closeModal(modalId);
            });
        });

        // Add student button
        document.getElementById('add-student-btn').addEventListener('click', () => {
            this.openStudentModal();
        });

        // Add grade button
        document.getElementById('add-grade-btn').addEventListener('click', () => {
            this.openGradeModal();
        });

        // Form submissions
        document.getElementById('student-form').addEventListener('submit', (e) => {
            this.handleStudentSubmit(e);
        });

        document.getElementById('grade-form').addEventListener('submit', (e) => {
            this.handleGradeSubmit(e);
        });

        // Search and filter
        document.getElementById('student-search').addEventListener('input', (e) => {
            this.filterStudents();
        });

        document.getElementById('class-filter').addEventListener('change', (e) => {
            this.filterStudents();
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    loadInitialData() {
        // Add sample data if no data exists
        if (this.students.length === 0) {
            this.addSampleData();
        }
        this.updateClassFilter();
        this.updateGradeStudentSelect();
    }

    addSampleData() {
        const sampleStudents = [
            {
                id: 'STU001',
                name: 'Alice Johnson',
                email: 'alice.johnson@school.edu',
                class: '10A',
                phone: '+1-555-0101',
                dateAdded: new Date().toISOString()
            },
            {
                id: 'STU002',
                name: 'Bob Smith',
                email: 'bob.smith@school.edu',
                class: '10A',
                phone: '+1-555-0102',
                dateAdded: new Date().toISOString()
            },
            {
                id: 'STU003',
                name: 'Carol Davis',
                email: 'carol.davis@school.edu',
                class: '10B',
                phone: '+1-555-0103',
                dateAdded: new Date().toISOString()
            },
            {
                id: 'STU004',
                name: 'David Wilson',
                email: 'david.wilson@school.edu',
                class: '10B',
                phone: '+1-555-0104',
                dateAdded: new Date().toISOString()
            }
        ];

        const sampleGrades = [
            { id: 'GRD001', studentId: 'STU001', subject: 'Mathematics', grade: 95, type: 'exam', date: '2025-01-15' },
            { id: 'GRD002', studentId: 'STU001', subject: 'Science', grade: 88, type: 'quiz', date: '2025-01-14' },
            { id: 'GRD003', studentId: 'STU002', subject: 'Mathematics', grade: 82, type: 'exam', date: '2025-01-15' },
            { id: 'GRD004', studentId: 'STU002', subject: 'English', grade: 90, type: 'assignment', date: '2025-01-13' },
            { id: 'GRD005', studentId: 'STU003', subject: 'Science', grade: 76, type: 'quiz', date: '2025-01-14' },
            { id: 'GRD006', studentId: 'STU003', subject: 'History', grade: 85, type: 'project', date: '2025-01-12' },
            { id: 'GRD007', studentId: 'STU004', subject: 'Mathematics', grade: 68, type: 'exam', date: '2025-01-15' },
            { id: 'GRD008', studentId: 'STU004', subject: 'English', grade: 72, type: 'assignment', date: '2025-01-13' }
        ];

        this.students = sampleStudents;
        this.grades = sampleGrades;
        this.saveData();
    }

    saveData() {
        localStorage.setItem('students', JSON.stringify(this.students));
        localStorage.setItem('grades', JSON.stringify(this.grades));
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Refresh content based on tab
        switch(tabName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'students':
                this.renderStudents();
                break;
            case 'grades':
                this.renderGrades();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
        }
    }

    updateHeaderStats() {
        document.getElementById('total-students').textContent = this.students.length;
        
        const avgGrade = this.calculateAverageGrade();
        document.getElementById('avg-grade').textContent = avgGrade.toFixed(1);
    }

    calculateAverageGrade() {
        if (this.grades.length === 0) return 0;
        const total = this.grades.reduce((sum, grade) => sum + grade.grade, 0);
        return total / this.grades.length;
    }

    renderDashboard() {
        this.renderTopPerformers();
        this.renderAtRiskStudents();
        this.renderGradeDistributionChart();
        this.renderTrendChart();
    }

    renderTopPerformers() {
        const container = document.getElementById('top-performers');
        const studentAverages = this.getStudentAverages();
        
        if (studentAverages.length === 0) {
            container.innerHTML = '<p class="empty-state">No students added yet</p>';
            return;
        }

        const topPerformers = studentAverages
            .sort((a, b) => b.average - a.average)
            .slice(0, 5);

        container.innerHTML = topPerformers.map((performer, index) => `
            <div class="performer-item">
                <div class="performer-rank">${index + 1}</div>
                <div class="performer-info">
                    <div class="performer-name">${performer.name}</div>
                    <div class="performer-grade">Average: ${performer.average.toFixed(1)}%</div>
                </div>
            </div>
        `).join('');
    }

    renderAtRiskStudents() {
        const container = document.getElementById('at-risk-students');
        const studentAverages = this.getStudentAverages();
        const atRiskStudents = studentAverages.filter(student => student.average < 70);

        if (atRiskStudents.length === 0) {
            container.innerHTML = '<p class="empty-state">No students at risk</p>';
            return;
        }

        container.innerHTML = atRiskStudents.map(student => `
            <div class="at-risk-item">
                <i class="fas fa-exclamation-triangle risk-icon"></i>
                <div class="risk-info">
                    <div class="risk-name">${student.name}</div>
                    <div class="risk-reason">Average: ${student.average.toFixed(1)}% - Needs attention</div>
                </div>
            </div>
        `).join('');
    }

    getStudentAverages() {
        return this.students.map(student => {
            const studentGrades = this.grades.filter(grade => grade.studentId === student.id);
            const average = studentGrades.length > 0 
                ? studentGrades.reduce((sum, grade) => sum + grade.grade, 0) / studentGrades.length 
                : 0;
            return {
                id: student.id,
                name: student.name,
                average: average
            };
        }).filter(student => student.average > 0);
    }

    renderGradeDistributionChart() {
        const ctx = document.getElementById('gradeChart').getContext('2d');
        
        if (this.charts.gradeChart) {
            this.charts.gradeChart.destroy();
        }

        const gradeRanges = {
            'A (90-100)': 0,
            'B (80-89)': 0,
            'C (70-79)': 0,
            'D (60-69)': 0,
            'F (0-59)': 0
        };

        this.grades.forEach(grade => {
            if (grade.grade >= 90) gradeRanges['A (90-100)']++;
            else if (grade.grade >= 80) gradeRanges['B (80-89)']++;
            else if (grade.grade >= 70) gradeRanges['C (70-79)']++;
            else if (grade.grade >= 60) gradeRanges['D (60-69)']++;
            else gradeRanges['F (0-59)']++;
        });

        this.charts.gradeChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(gradeRanges),
                datasets: [{
                    data: Object.values(gradeRanges),
                    backgroundColor: [
                        '#10B981', // Green for A
                        '#3B82F6', // Blue for B
                        '#F59E0B', // Yellow for C
                        '#F97316', // Orange for D
                        '#EF4444'  // Red for F
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    renderTrendChart() {
        const ctx = document.getElementById('trendChart').getContext('2d');
        
        if (this.charts.trendChart) {
            this.charts.trendChart.destroy();
        }

        // Group grades by month
        const monthlyData = {};
        this.grades.forEach(grade => {
            const month = new Date(grade.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            if (!monthlyData[month]) {
                monthlyData[month] = [];
            }
            monthlyData[month].push(grade.grade);
        });

        const labels = Object.keys(monthlyData).sort();
        const averages = labels.map(month => {
            const grades = monthlyData[month];
            return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
        });

        this.charts.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Grade',
                    data: averages,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    renderStudents() {
        this.filterStudents();
    }

    filterStudents() {
        const searchTerm = document.getElementById('student-search').value.toLowerCase();
        const classFilter = document.getElementById('class-filter').value;
        
        let filteredStudents = this.students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm) ||
                                student.id.toLowerCase().includes(searchTerm) ||
                                student.email.toLowerCase().includes(searchTerm);
            const matchesClass = !classFilter || student.class === classFilter;
            return matchesSearch && matchesClass;
        });

        const container = document.getElementById('students-list');
        
        if (filteredStudents.length === 0) {
            container.innerHTML = '<p class="empty-state">No students found matching your criteria</p>';
            return;
        }

        container.innerHTML = filteredStudents.map(student => {
            const studentGrades = this.grades.filter(grade => grade.studentId === student.id);
            const average = studentGrades.length > 0 
                ? (studentGrades.reduce((sum, grade) => sum + grade.grade, 0) / studentGrades.length).toFixed(1)
                : 'N/A';

            return `
                <div class="student-card">
                    <div class="student-header">
                        <div class="student-avatar">
                            ${student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div class="student-info">
                            <h4>${student.name}</h4>
                            <div class="student-id">ID: ${student.id}</div>
                        </div>
                    </div>
                    <div class="student-details">
                        <div class="student-detail">
                            <i class="fas fa-envelope"></i>
                            <span>${student.email || 'No email'}</span>
                        </div>
                        <div class="student-detail">
                            <i class="fas fa-users"></i>
                            <span>Class: ${student.class}</span>
                        </div>
                        <div class="student-detail">
                            <i class="fas fa-phone"></i>
                            <span>${student.phone || 'No phone'}</span>
                        </div>
                        <div class="student-detail">
                            <i class="fas fa-chart-line"></i>
                            <span>Average: ${average}${average !== 'N/A' ? '%' : ''}</span>
                        </div>
                    </div>
                    <div class="student-actions">
                        <button class="btn btn-secondary btn-sm" onclick="tracker.editStudent('${student.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="tracker.deleteStudent('${student.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderGrades() {
        const tbody = document.querySelector('#grades-table tbody');
        
        if (this.grades.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No grades recorded yet</td></tr>';
            return;
        }

        const sortedGrades = [...this.grades].sort((a, b) => new Date(b.date) - new Date(a.date));

        tbody.innerHTML = sortedGrades.map(grade => {
            const student = this.students.find(s => s.id === grade.studentId);
            const studentName = student ? student.name : 'Unknown Student';
            
            let gradeClass = 'grade-poor';
            if (grade.grade >= 90) gradeClass = 'grade-excellent';
            else if (grade.grade >= 80) gradeClass = 'grade-good';
            else if (grade.grade >= 70) gradeClass = 'grade-average';

            return `
                <tr>
                    <td>${studentName}</td>
                    <td>${grade.subject}</td>
                    <td><span class="grade-badge ${gradeClass}">${grade.grade}%</span></td>
                    <td>${new Date(grade.date).toLocaleDateString()}</td>
                    <td><span class="capitalize">${grade.type}</span></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="tracker.editGrade('${grade.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="tracker.deleteGrade('${grade.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderAnalytics() {
        this.renderSubjectChart();
        this.renderMonthlyChart();
        this.updatePerformanceMetrics();
    }

    renderSubjectChart() {
        const ctx = document.getElementById('subjectChart').getContext('2d');
        
        if (this.charts.subjectChart) {
            this.charts.subjectChart.destroy();
        }

        const subjectData = {};
        this.grades.forEach(grade => {
            if (!subjectData[grade.subject]) {
                subjectData[grade.subject] = [];
            }
            subjectData[grade.subject].push(grade.grade);
        });

        const subjects = Object.keys(subjectData);
        const averages = subjects.map(subject => {
            const grades = subjectData[subject];
            return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
        });

        this.charts.subjectChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: subjects,
                datasets: [{
                    label: 'Average Grade',
                    data: averages,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: '#667eea',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    renderMonthlyChart() {
        const ctx = document.getElementById('monthlyChart').getContext('2d');
        
        if (this.charts.monthlyChart) {
            this.charts.monthlyChart.destroy();
        }

        const monthlyData = {};
        this.grades.forEach(grade => {
            const month = new Date(grade.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            if (!monthlyData[month]) {
                monthlyData[month] = { total: 0, count: 0 };
            }
            monthlyData[month].total += grade.grade;
            monthlyData[month].count += 1;
        });

        const labels = Object.keys(monthlyData).sort();
        const averages = labels.map(month => monthlyData[month].total / monthlyData[month].count);

        this.charts.monthlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly Average',
                    data: averages,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10B981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    updatePerformanceMetrics() {
        const grades = this.grades.map(g => g.grade);
        
        if (grades.length === 0) {
            document.getElementById('highest-grade').textContent = '-';
            document.getElementById('lowest-grade').textContent = '-';
            document.getElementById('pass-rate').textContent = '-';
            document.getElementById('improvement-rate').textContent = '-';
            return;
        }

        const highest = Math.max(...grades);
        const lowest = Math.min(...grades);
        const passRate = (grades.filter(g => g >= 70).length / grades.length * 100).toFixed(1);
        
        // Calculate improvement rate (simplified)
        const recentGrades = this.grades
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, Math.floor(grades.length / 2));
        const olderGrades = this.grades
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(Math.floor(grades.length / 2));
        
        const recentAvg = recentGrades.length > 0 
            ? recentGrades.reduce((sum, g) => sum + g.grade, 0) / recentGrades.length 
            : 0;
        const olderAvg = olderGrades.length > 0 
            ? olderGrades.reduce((sum, g) => sum + g.grade, 0) / olderGrades.length 
            : 0;
        
        const improvement = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg * 100).toFixed(1) : 0;

        document.getElementById('highest-grade').textContent = `${highest}%`;
        document.getElementById('lowest-grade').textContent = `${lowest}%`;
        document.getElementById('pass-rate').textContent = `${passRate}%`;
        document.getElementById('improvement-rate').textContent = `${improvement > 0 ? '+' : ''}${improvement}%`;
    }

    updateClassFilter() {
        const select = document.getElementById('class-filter');
        const classes = [...new Set(this.students.map(student => student.class))].sort();
        
        select.innerHTML = '<option value="">All Classes</option>' + 
            classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');
    }

    updateGradeStudentSelect() {
        const select = document.getElementById('grade-student');
        select.innerHTML = '<option value="">Select Student</option>' + 
            this.students.map(student => 
                `<option value="${student.id}">${student.name} (${student.id})</option>`
            ).join('');
    }

    openStudentModal(studentId = null) {
        this.currentEditingStudent = studentId;
        const modal = document.getElementById('student-modal');
        const title = document.getElementById('student-modal-title');
        const form = document.getElementById('student-form');
        
        if (studentId) {
            const student = this.students.find(s => s.id === studentId);
            title.textContent = 'Edit Student';
            document.getElementById('student-name').value = student.name;
            document.getElementById('student-id').value = student.id;
            document.getElementById('student-email').value = student.email || '';
            document.getElementById('student-class').value = student.class;
            document.getElementById('student-phone').value = student.phone || '';
        } else {
            title.textContent = 'Add Student';
            form.reset();
        }
        
        modal.classList.add('active');
    }

    openGradeModal(gradeId = null) {
        this.currentEditingGrade = gradeId;
        const modal = document.getElementById('grade-modal');
        const form = document.getElementById('grade-form');
        
        if (gradeId) {
            const grade = this.grades.find(g => g.id === gradeId);
            document.getElementById('grade-student').value = grade.studentId;
            document.getElementById('grade-subject').value = grade.subject;
            document.getElementById('grade-value').value = grade.grade;
            document.getElementById('grade-type').value = grade.type;
            document.getElementById('grade-date').value = grade.date;
        } else {
            form.reset();
            document.getElementById('grade-date').valueAsDate = new Date();
        }
        
        modal.classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        this.currentEditingStudent = null;
        this.currentEditingGrade = null;
    }

    handleStudentSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('student-name').value,
            id: document.getElementById('student-id').value,
            email: document.getElementById('student-email').value,
            class: document.getElementById('student-class').value,
            phone: document.getElementById('student-phone').value
        };

        // Validate unique student ID
        const existingStudent = this.students.find(s => s.id === formData.id);
        if (existingStudent && (!this.currentEditingStudent || existingStudent.id !== this.currentEditingStudent)) {
            alert('Student ID already exists. Please use a different ID.');
            return;
        }

        if (this.currentEditingStudent) {
            // Update existing student
            const index = this.students.findIndex(s => s.id === this.currentEditingStudent);
            this.students[index] = { ...this.students[index], ...formData };
        } else {
            // Add new student
            this.students.push({
                ...formData,
                dateAdded: new Date().toISOString()
            });
        }

        this.saveData();
        this.updateHeaderStats();
        this.updateClassFilter();
        this.updateGradeStudentSelect();
        this.renderStudents();
        this.closeModal('student-modal');
    }

    handleGradeSubmit(e) {
        e.preventDefault();
        
        const formData = {
            studentId: document.getElementById('grade-student').value,
            subject: document.getElementById('grade-subject').value,
            grade: parseInt(document.getElementById('grade-value').value),
            type: document.getElementById('grade-type').value,
            date: document.getElementById('grade-date').value
        };

        if (this.currentEditingGrade) {
            // Update existing grade
            const index = this.grades.findIndex(g => g.id === this.currentEditingGrade);
            this.grades[index] = { ...this.grades[index], ...formData };
        } else {
            // Add new grade
            this.grades.push({
                id: 'GRD' + Date.now(),
                ...formData
            });
        }

        this.saveData();
        this.updateHeaderStats();
        this.renderGrades();
        this.renderDashboard();
        this.closeModal('grade-modal');
    }

    editStudent(studentId) {
        this.openStudentModal(studentId);
    }

    editGrade(gradeId) {
        this.openGradeModal(gradeId);
    }

    deleteStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (confirm(`Are you sure you want to delete ${student.name}? This will also delete all their grades.`)) {
            this.students = this.students.filter(s => s.id !== studentId);
            this.grades = this.grades.filter(g => g.studentId !== studentId);
            this.saveData();
            this.updateHeaderStats();
            this.updateClassFilter();
            this.updateGradeStudentSelect();
            this.renderStudents();
            this.renderGrades();
            this.renderDashboard();
        }
    }

    deleteGrade(gradeId) {
        if (confirm('Are you sure you want to delete this grade?')) {
            this.grades = this.grades.filter(g => g.id !== gradeId);
            this.saveData();
            this.updateHeaderStats();
            this.renderGrades();
            this.renderDashboard();
        }
    }
}

// Initialize the application
const tracker = new StudentTracker();

// Make tracker globally available for onclick handlers
window.tracker = tracker;
