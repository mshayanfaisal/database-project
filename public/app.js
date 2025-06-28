function App() {
    // Object.entries(params).reduce((p, [k, v], i) => ({ ...p, [k]: i <= 0 ? v: '' }), {});
    // Object.assign({}, ...Object.entries(params).map(([k, v]) => ({[k]: v })));
    return {
        page: 1,
        index: 0,
        years: [],
        semesters: [],
        batches: [],
        recaps:[],
        students:[],
        params: { pYear: '', pSem: '', pBatch: '', pRecap: '' },
        Reset(){
            this.params = { pYear: '', pSem: '', pBatch: '', pRecap: '' };
        },
        async getYears() {
            const years = await fetch("/api/years").then((res) => res.json());
            console.log(years)
            this.years = years;
        },
        async getSemester(year) {
            console.log(year);
            this.index = 0;
            this.params['pYear'] = year
            const sems = await fetch(`/api/semesters`).then((res) => res.json());
            console.log(sems)
            this.semesters = sems;
            this.params = Object.entries(this.params).reduce((p, [k, v], i) => ({ ...p, [k]: i <= this.index ? v : '' }), {});
        },
        async getBatch(sem) {
            console.log(sem);
            this.index = 1;
            this.params['pSem'] = sem
            const batches = await fetch(`/api/batch/${this.params.pYear}/${this.params.pSem}`).then((res) => res.json());
            console.log(batches)
            this.batches = batches
            this.params = Object.entries(this.params).reduce((p, [k, v], i) => ({ ...p, [k]: i <= this.index ? v : '' }), {});
        },
        async getClass(batch) {
            console.log(batch);
            this.index = 2;
            this.params['pBatch'] = batch
            this.students = [];
            const recaps = await fetch(`/api/batch/${this.params.pYear}/${this.params.pSem}/${this.params.pBatch}`).then((res) => res.json());
            console.log(recaps)
            this.recaps = recaps
            this.params = Object.entries(this.params).reduce((p, [k, v], i) => ({ ...p, [k]: i <= this.index ? v : '' }), {});
        },
        async getRecap(rid) {
            console.log(rid);
            this.index = 3;
            this.params['pRecap'] = rid
            this.students = [];
            const students = await fetch(`/api/recap/${this.params.pRecap}`).then((res) => res.json());
            console.log(students)
            this.students = students
            this.params = Object.entries(this.params).reduce((p, [k, v], i) => ({ ...p, [k]: i <= this.index ? v : '' }), {});
        },
    };
}
