// lib/auth.ts

type User = {
  username: string
  password: string
  role: 'admin' | 'user'
}

export function getUsers(): User[] {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('users') || '[]')
  }
  return []
}

export function saveUser(user: User) {
  const users = getUsers()
  users.push(user)
  localStorage.setItem('users', JSON.stringify(users))
}

export function loginUser(username: string, password: string): User | undefined {
  const users = getUsers()
  return users.find(u => u.username === username && u.password === password)
}

export function getCurrentUser(): User | undefined {
  if (typeof window !== 'undefined') {
    const users = getUsers()
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))

    if (token) {
      const username = token.split('=')[1]
      return users.find(u => u.username === username)
    }
  }
  return undefined
}
