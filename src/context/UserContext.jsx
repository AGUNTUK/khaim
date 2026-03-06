import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const UserContext = createContext()

const STORAGE_KEYS = {
  users: 'khaim-users',
  currentUserId: 'khaim-current-user-id',
}

const demoUsers = [
  {
    id: 'USR-001',
    name: 'Rahim Ahmed',
    email: 'rahim@khaim.com',
    phone: '01712345678',
    password: 'khaim123',
    joinedAt: '2025-01-15T10:00:00.000Z',
    addresses: [
      {
        id: 'ADDR-001',
        label: 'Home',
        line1: 'House 12, Road 5, Rangpur',
        instructions: 'Near Shapla Chattar',
        isDefault: true,
      },
    ],
  },
  {
    id: 'USR-002',
    name: 'Fatema Begum',
    email: 'fatema@khaim.com',
    phone: '01711234567',
    password: 'khaim123',
    joinedAt: '2025-02-01T09:30:00.000Z',
    addresses: [
      {
        id: 'ADDR-002',
        label: 'Office',
        line1: 'Shapla Tower, Rangpur',
        instructions: '3rd floor reception',
        isDefault: true,
      },
    ],
  },
]

const normalizePhone = value => (value || '').replace(/\D/g, '')

const normalizeAddress = (address, index) => ({
  id: address.id || `ADDR-${Date.now().toString().slice(-6)}-${index}`,
  label: (address.label || 'Address').trim(),
  line1: (address.line1 || '').trim(),
  instructions: (address.instructions || '').trim(),
  isDefault: !!address.isDefault,
})

const normalizeUserRecord = user => ({
  ...user,
  name: user.name || '',
  email: (user.email || '').trim().toLowerCase(),
  phone: normalizePhone(user.phone),
  password: user.password || '',
  joinedAt: user.joinedAt || new Date().toISOString(),
  addresses: Array.isArray(user.addresses)
    ? user.addresses.map((address, index) => normalizeAddress(address, index))
    : [],
})

const sanitizeUser = user => {
  if (!user) return null

  const { password, ...safeUser } = user
  return safeUser
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.users)

    if (saved) {
      return JSON.parse(saved).map(normalizeUserRecord)
    }

    return demoUsers.map(normalizeUserRecord)
  })

  const [currentUserId, setCurrentUserId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.currentUserId)
    return saved || null
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.currentUserId, currentUserId)
      return
    }

    localStorage.removeItem(STORAGE_KEYS.currentUserId)
  }, [currentUserId])

  const currentUser = useMemo(
    () => users.find(user => user.id === currentUserId) || null,
    [users, currentUserId]
  )

  const register = ({ name, email, phone, password }) => {
    const normalizedEmail = email.trim().toLowerCase()

    if (users.some(user => user.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'An account with this email already exists.' }
    }

    const newUser = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizePhone(phone),
      password,
      joinedAt: new Date().toISOString(),
      addresses: [],
    }

    setUsers(prev => [...prev, newUser])
    setCurrentUserId(newUser.id)

    return { success: true, user: sanitizeUser(newUser) }
  }

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()

    const user = users.find(
      candidate =>
        candidate.email.toLowerCase() === normalizedEmail && candidate.password === password
    )

    if (!user) {
      return { success: false, message: 'Invalid email or password.' }
    }

    setCurrentUserId(user.id)

    return { success: true, user: sanitizeUser(user) }
  }

  const logout = () => {
    setCurrentUserId(null)
  }

  const updateProfile = updates => {
    if (!currentUser) return { success: false, message: 'Please sign in first.' }

    if (updates.email) {
      const normalizedEmail = updates.email.trim().toLowerCase()
      const duplicateEmail = users.some(
        user => user.id !== currentUser.id && user.email.toLowerCase() === normalizedEmail
      )

      if (duplicateEmail) {
        return { success: false, message: 'That email is already used by another account.' }
      }

      updates.email = normalizedEmail
    }

    if (updates.phone) {
      updates.phone = normalizePhone(updates.phone)
    }

    setUsers(prev =>
      prev.map(user =>
        user.id === currentUser.id
          ? {
              ...user,
              ...updates,
            }
          : user
      )
    )

    return { success: true }
  }

  const changePassword = (currentPassword, newPassword) => {
    if (!currentUser) return { success: false, message: 'Please sign in first.' }

    if (currentUser.password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect.' }
    }

    setUsers(prev =>
      prev.map(user =>
        user.id === currentUser.id
          ? {
              ...user,
              password: newPassword,
            }
          : user
      )
    )

    return { success: true }
  }

  const addAddress = address => {
    if (!currentUser) return

    const nextAddress = {
      id: `ADDR-${Date.now().toString().slice(-6)}`,
      label: address.label.trim(),
      line1: address.line1.trim(),
      instructions: (address.instructions || '').trim(),
      isDefault: !!address.isDefault,
    }

    setUsers(prev =>
      prev.map(user => {
        if (user.id !== currentUser.id) return user

        const shouldResetDefaults = nextAddress.isDefault || user.addresses.length === 0

        return {
          ...user,
          addresses: [
            ...user.addresses.map(existing =>
              shouldResetDefaults
                ? {
                    ...existing,
                    isDefault: false,
                  }
                : existing
            ),
            {
              ...nextAddress,
              isDefault: shouldResetDefaults ? true : nextAddress.isDefault,
            },
          ],
        }
      })
    )
  }

  const updateAddress = (addressId, updates) => {
    if (!currentUser) return

    setUsers(prev =>
      prev.map(user => {
        if (user.id !== currentUser.id) return user

        let addresses = user.addresses.map(address =>
          address.id === addressId
            ? {
                ...address,
                ...updates,
              }
            : address
        )

        if (updates.isDefault) {
          addresses = addresses.map(address => ({
            ...address,
            isDefault: address.id === addressId,
          }))
        }

        return {
          ...user,
          addresses,
        }
      })
    )
  }

  const removeAddress = addressId => {
    if (!currentUser) return

    setUsers(prev =>
      prev.map(user => {
        if (user.id !== currentUser.id) return user

        const nextAddresses = user.addresses.filter(address => address.id !== addressId)

        if (nextAddresses.length > 0 && !nextAddresses.some(address => address.isDefault)) {
          nextAddresses[0] = {
            ...nextAddresses[0],
            isDefault: true,
          }
        }

        return {
          ...user,
          addresses: nextAddresses,
        }
      })
    )
  }

  const setDefaultAddress = addressId => {
    if (!currentUser) return

    setUsers(prev =>
      prev.map(user =>
        user.id === currentUser.id
          ? {
              ...user,
              addresses: user.addresses.map(address => ({
                ...address,
                isDefault: address.id === addressId,
              })),
            }
          : user
      )
    )
  }

  const getDefaultAddress = () => {
    if (!currentUser) return null

    return currentUser.addresses.find(address => address.isDefault) || currentUser.addresses[0] || null
  }

  const getUserOrders = orders => {
    if (!currentUser) return []

    const normalizedUserPhone = normalizePhone(currentUser.phone)

    return orders
      .filter(order => {
        if (order.userId) {
          return order.userId === currentUser.id
        }

        return normalizePhone(order.phone) === normalizedUserPhone
      })
      .sort((first, second) => {
        const firstDate = new Date(first.createdAt || first.date).getTime()
        const secondDate = new Date(second.createdAt || second.date).getTime()
        return secondDate - firstDate
      })
  }

  return (
    <UserContext.Provider
      value={{
        users: users.map(user => sanitizeUser(user)),
        currentUser: sanitizeUser(currentUser),
        isAuthenticated: !!currentUser,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
        getDefaultAddress,
        getUserOrders,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
