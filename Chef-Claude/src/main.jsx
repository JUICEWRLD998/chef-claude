export default function Main() {
  return (
    <main className="main-content">
      <form className="ingredient-form">
        <input 
          type="text" 
          placeholder="e.g. jollof rice" 
          aria-label="Add ingredient"
          className="ingredient-input"
        />
        <button type="submit" className="add-ingredient-btn">
          + Add ingredient
        </button>
      </form>
    </main>
  );
}