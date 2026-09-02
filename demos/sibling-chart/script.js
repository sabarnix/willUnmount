const chart = document.getElementById('chart')
const plot = document.getElementById('chart-plot')
const legend = document.getElementById('chart-legend')

/* Neither handler touches a colour or a label — CSS derives both from position. */

document.getElementById('add-group').addEventListener('click', () => {
  const group = document.createElement('div')
  group.className = 'group'

  for (let i = 0; i < 3; i++) {
    const bar = document.createElement('div')
    bar.className = 'bar'
    bar.style.setProperty('--value', Math.floor(Math.random() * 70) + 10)
    group.append(bar)
  }

  plot.append(group)
  const groupIndex = legend.children.length + 1
  legend.insertAdjacentHTML(
    'beforeend',
    `<li aria-label="Group ${groupIndex}"><span class="swatch" aria-hidden="true"></span></li>`
  )
})

document.getElementById('randomize').addEventListener('click', () => {
  chart.style.setProperty('--hue-base', Math.floor(Math.random() * 360))
  chart.style.setProperty('--saturation', `${Math.floor(Math.random() * 45) + 40}%`)
})
