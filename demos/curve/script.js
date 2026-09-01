const curve = document.getElementById('curve')
const body = document.getElementById('curve-body')

const NAMES = ['Linus', 'Ida', 'Donald', 'Radia', 'Guido', 'Anita', 'Margaret', 'Alonzo']

/*
 * Placing the row is the only decision JS makes. The band, the tint, and the
 * letter all follow from where the row lands and how many rows there are — so
 * one insert can change the grade of a row nothing touched.
 */
document.getElementById('add-student').addEventListener('click', () => {
  const score = Math.floor(Math.random() * 55) + 45
  const name = NAMES[Math.floor(Math.random() * NAMES.length)]

  const row = document.createElement('tr')
  row.dataset.score = score
  row.innerHTML = `
    <td>${name}</td>
    <td class="score">
      <span class="score__track"><span class="bar" style="--value: ${score}"></span></span>
      <span class="score__num">${score}</span>
    </td>
    <td class="grade"></td>`

  const next = [...body.children].find((r) => Number(r.dataset.score) < score)
  body.insertBefore(row, next ?? null)
})

document.getElementById('remove-student').addEventListener('click', () => {
  if (body.children.length > 1) body.lastElementChild.remove()
})

/* Re-grades every row from a single token: 3 → 4 → 5 → 3. */
const cycle = document.getElementById('cycle-bands')
let bands = 4

cycle.addEventListener('click', () => {
  bands = bands === 5 ? 3 : bands + 1

  curve.style.setProperty('--bands', bands)
  cycle.textContent = `Curve: ${bands} bands`
})
