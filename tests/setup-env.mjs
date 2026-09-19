// Test preload (bunfig.toml). Forces the widget on so suite results don't
// depend on ~/.omp/agent/headroom.yml (module cache is shared across files).
process.env.OMP_HEADROOM_WIDGET = "1";
