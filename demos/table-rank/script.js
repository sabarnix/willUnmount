const board = document.getElementById('board-body')

const NAMES = ['Alan', 'Margaret', 'Linus', 'Ida', 'Donald', 'Radia', 'Guido', 'Anita']

/*
 * Placing the row is the only decision JS makes. The rank number, the "of N",
 * the tint, and the weight all follow from where the row lands.
 */
document.getElementById('add-row').addEventListener('click', () => {
  const score = Math.floor(Math.random() * 90) + 10
  const name = NAMES[Math.floor(Math.random() * NAMES.length)]

  const row = document.createElement('tr')
  row.dataset.score = score
  row.innerHTML = `
    <td class="rank"></td>
    <td>${name}</td>
    <td class="score">
      <span class="score__track"><span class="bar" style="--value: ${score}"></span></span>
      <span class="score__num">${score}</span>
    </td>`

  const next = [...board.children].find((r) => Number(r.dataset.score) < score)
  board.insertBefore(row, next ?? null)
})

document.getElementById('remove-row').addEventListener('click', () => {
  if (board.children.length > 1) board.lastElementChild.remove()
})
