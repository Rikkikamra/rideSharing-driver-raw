// The SavedPlacesScreen is an alias for MyPlacesScreen.  Previously the
// project contained two separate implementations that both displayed
// the user’s saved places.  To eliminate duplication we re‑export the
// canonical screen here.  Navigation can reference either name
// (`SavedPlacesScreen` or `MyPlacesScreen`) and receive the same UI.

export { default } from './MyPlacesScreen';