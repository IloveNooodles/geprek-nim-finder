const STUDENT_JSON_LIST = [
  '13.json',
  '14.json',
  '15.json',
  '16.json',
  '17.json',
  '18.json',
  '19.json',
  '20.json',
  '21.json',
  '22.json'
]

type Student = [string, string, string];

const setupStudentsData = async () => {
  const response = await fetch(
    'https://cdn.jsdelivr.net/gh/mkamadeus/geprek-nim-data@v1.0.1/13_23.json'
  )

  const flattenStudentList: Array<Student> = []
  const studentsList: Array<Array<Student>> = await response.json()
  for (const student of studentsList) {
    flattenStudentList.push(...student)
  }

  // studentsList.sort((s1, s2) => s1[0].localeCompare(s2[0]))
  await useStorage().setItem<Student[]>(
    'students',
    flattenStudentList.map(s => ({
      name: s[0],
      tpbID: s[1] as `${number}`,
      majorID: s[2] as `${number}`
    }))
  )

  const student = await useStorage().getItem('students')
  console.log(student)
}

// TODO: fetch major and faculty data mapping
const setupMajorAndFacultyMapping = async () => {
  const facultyResponse = await fetch(
    'https://cdn.jsdelivr.net/gh/mkamadeus/geprek-nim-data@v1.0.1/kode_fakultas.json'
  )
  if (!facultyResponse.ok) {
    throw new Error('Failed to fetch faculty mapping')
  }

  const majorResponse = await fetch(
    'https://cdn.jsdelivr.net/gh/mkamadeus/geprek-nim-data@v1.0.1/kode_jurusan.json'
  )
  if (!majorResponse.ok) {
    throw new Error('Failed to fetch major mapping')
  }

  const facultyMapping = await facultyResponse.json()
  const majorMapping = await majorResponse.json()

  const mapping = { ...facultyMapping, ...majorMapping }
  await useStorage().setItem<Record<string, string>>('codes', mapping)

  const facultyListResponse = await fetch(
    'https://cdn.jsdelivr.net/gh/mkamadeus/geprek-nim-data@v1.0.1/list_fakultas.json'
  )
  if (!facultyListResponse.ok) {
    throw new Error('Failed to fetch faculty mapping')
  }

  const majorListResponse = await fetch(
    'https://cdn.jsdelivr.net/gh/mkamadeus/geprek-nim-data@v1.0.1/list_jurusan.json'
  )
  if (!majorListResponse.ok) {
    throw new Error('Failed to fetch major mapping')
  }

  const facultyListMapping = await facultyListResponse.json()
  const majorListMapping = await majorListResponse.json()

  const listMapping = { ...facultyListMapping, ...majorListMapping }
  await useStorage().setItem<Record<string, string>>('list', listMapping)
}

export default defineNitroPlugin(async (nitroApp) => {
  // setup student data
  setupStudentsData()
  setupMajorAndFacultyMapping()
})
