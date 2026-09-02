document.getElementById('chip-add-form').addEventListener('submit', (e) => {
  e.preventDefault()

  const input = document.getElementById('chip-add-input')
  const value = input.value.trim()
  if (!value) return

  const li = document.createElement('li')
  li.className = 'badge badge-soft badge-primary'
  li.textContent = value
  document.querySelector('#chips-list li.more').before(li)

  input.value = ''
})
