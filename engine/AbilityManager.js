export default class AbilityManager {
    constructor() {
        this.abilities = {
            globalTimeReverse: { uses: Infinity, max: Infinity, label: "Global Time Reverse" },
            localTimeStop:     { uses: 0, max: 0, label: "Local Time Stop" },
        };
    }

    setAbility(name, uses, max = uses, extra = {}) {
        if (!this.abilities[name]) return;
        this.abilities[name].uses = uses;
        this.abilities[name].max = max;
        Object.assign(this.abilities[name], extra);
    }

    use(name) {
        if (!this.abilities[name]) return false;
        if (this.abilities[name].uses > 0) {
            this.abilities[name].uses--;
            return true;
        }
        return false;
    }

    get(name) {
        return this.abilities[name];
    }

    reset() {
        for (const k in this.abilities) {
            this.abilities[k].uses = this.abilities[k].max;
        }
    }

    getAll() {
        return this.abilities;
    }
}