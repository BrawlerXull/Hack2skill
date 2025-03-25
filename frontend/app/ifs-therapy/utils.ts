export const format = (date: Date, formatString: string): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  // Format: "MMMM d, yyyy"
  if (formatString === "MMMM d, yyyy") {
    return `${months[month]} ${day}, ${year}`
  }

  // Format: "h:mm a"
  if (formatString === "h:mm a") {
    const period = hours >= 12 ? "PM" : "AM"
    const hour = hours % 12 || 12
    return `${hour}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Format: "PPP" (long date format)
  if (formatString === "PPP") {
    return `${months[month]} ${day}, ${year}`
  }

  return date.toDateString()
}

