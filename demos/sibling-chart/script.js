document.getElementById('add-group-btn').addEventListener('click', () => {
  const chart = document.getElementById('pl-chart')
  const labels = document.getElementById('pl-labels')
  const legend = document.getElementById('pl-legend')

  const group = document.createElement('div')
  group.className = 'group'

  for (let i = 0; i < 3; i++) {
    const bar = document.createElement('div')
    bar.className = 'bar'
    bar.style.setProperty('--value', Math.floor(Math.random() * 70) + 10)
    group.appendChild(bar)
  }

  chart.appendChild(group)

  const quarter = `Q${labels.children.length + 1}`

  const label = document.createElement('span')
  label.textContent = quarter
  labels.appendChild(label)

  const legendItem = document.createElement('li')
  legendItem.innerHTML = `<span class="swatch"></span><span class="label">${quarter}</span>`
  legend.appendChild(legendItem)
})
