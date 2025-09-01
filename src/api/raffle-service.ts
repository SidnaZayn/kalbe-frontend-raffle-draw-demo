//import axios from 'axios'
import { supabase } from '@/lib/supabaseClient'
import * as XLSX from 'xlsx'

//const API_BASE_URL = 'http://localhost:3000' // Adjust the URL as needed
const USER_EMAIL = import.meta.env.VITE_SUPABASE_EMAIL
const USER_PASSWORD = import.meta.env.VITE_SUPABASE_PASS

export interface Raffle {
  name: string
  description?: string
  // add other fields as needed
}

export interface Hadiah {
  id: number
  nama: string
  pemenangId?: number | null
  img_url?: string
  // add other fields as needed
}

export type PesertaCreateManyInput = {
  id?: number
  nik: string
  nama: string
  status: boolean
  departement_id?: number | null
  entity?: string | null
  location?: string | null
}

export type { Raffle as RaffleType, Hadiah as HadiahType }

const getSkipDepartement = async () => {
  const skipDepartement = await supabase.from('Departement').select('id').eq('status', false)
  if (skipDepartement.error) throw skipDepartement.error
  return skipDepartement.data?.map((d) => d.id) || []
}

export async function raffle() {
  await supabase.auth.signInWithPassword({
    email: USER_EMAIL,
    password: USER_PASSWORD,
  })
  const skipDepartement = await getSkipDepartement()

  const { data: peserta, error } = await supabase
    .from('Peserta')
    .select(`id, nik, nama, departement_id, entity, location, "Departement"(id,name)`)
    .eq('status', false)
    .not('departement_id', 'in', `(${skipDepartement.join(',')})`)
    .order('id', { ascending: true })

  if (error) {
    throw error
  }

  const pesertaNIK = (peserta ?? []).map((peserta) => ({
    id: peserta.id,
    nik: peserta.nik,
    nama: peserta.nama,
    departement_id: peserta.departement_id,
    entity: peserta.entity,
    location: peserta.location,
    Departement: peserta.Departement,
  }))

  const randomIndex = Math.floor(Math.random() * pesertaNIK.length)
  const randomPeserta = pesertaNIK[randomIndex]
  return { ...randomPeserta }
}

export async function parsePesertaExcel(file: File): Promise<
  Array<{
    nik: string
    nama: string
    status: boolean
    departement: string
    entity?: string
    location?: string
  }>
> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json: (string | number | undefined)[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        })
        // Remove header row and map to object
        const result = json.slice(1).map((row) => ({
          nik: String(row[0] ?? ''),
          nama: String(row[1] ?? ''),
          entity: String(row[2] ?? ''),
          location: String(row[3] ?? ''),
          departement: String(row[4] ?? ''),
          status: false, // Default status
        }))
        resolve(result)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = (err) => reject(err)
    reader.readAsArrayBuffer(file)
  })
}

const departementTextToId = (departement: string) => {
  const map: {
    [key: string]: number
  } = {
    'KF Corporate': 1,
    'KF Ethical': 2,
    'KF Vision': 3,
    'KF Nemitz': 4,
    'KF Aesterion': 5,
    'KF BO Cikarang': 6,
    'KF SCI': 7,
    'KF Kalbe International': 8,
  }

  return map[departement] || null
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const uploadPeserta = async (peserta: any[]) => {
  if (!peserta) {
    throw new Error('Peserta is null')
  }

  const invalidPeserta: PesertaCreateManyInput[] = []
  const validPeserta: PesertaCreateManyInput[] = []

  for (let i = 0; i < peserta.length; i++) {
    const p = peserta[i]
    if (!p.nik || !p.nama || !p.departement) {
      invalidPeserta.push(p)
    } else {
      const departementId = departementTextToId(p.departement)
      validPeserta.push({
        nik: p.nik,
        nama: p.nama,
        status: false,
        departement_id: departementId,
        entity: p.entity || null,
        location: p.location || null,
      })
    }
  }

  let result = null
  if (validPeserta.length > 0) {
    await supabase.auth.signInWithPassword({
      email: USER_EMAIL,
      password: USER_PASSWORD,
    })

    const { data, error } = await supabase.from('Peserta').insert(validPeserta) // upsert to skip duplicates

    if (error) throw error
    result = data
  }

  return { result, invalidPeserta }
}

export async function getPeserta(isAll: boolean = false) {
  const query = supabase
    .from('Peserta')
    .select(`id, nik, nama, departement_id, entity, location, "Departement"(id,name)`)
    .order('id', { ascending: true })

  if (!isAll) {
    query.eq('status', false)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getPesertaById(id: string | number) {
  const { data, error } = await supabase.from('Peserta').select('*').eq('id', id).single()

  if (error) throw error
  return data
}

export async function deletePeserta(id: string | undefined) {
  await supabase.auth.signInWithPassword({
    email: USER_EMAIL,
    password: USER_PASSWORD,
  })

  const { data, error } = await supabase.from('Peserta').delete().eq('id', id)

  if (error) throw error
  return data
}

export async function updateStatusPeserta(nik: Array<string | number>) {
  await supabase.auth.signInWithPassword({
    email: USER_EMAIL,
    password: USER_PASSWORD,
  })

  const { error } = await supabase.from('Peserta').update({ status: true }).eq('nik', nik).select()
  if (error) throw error
  return true
}

export async function updateHadiah(winnerId: number | string, hadiahId: number | string) {
  await supabase.auth.signInWithPassword({
    email: USER_EMAIL,
    password: USER_PASSWORD,
  })

  const { error } = await supabase
    .from('Hadiah')
    .update({ pemenang: winnerId })
    .eq('id', hadiahId)
    .select()

  if (error) throw error
  return true
}

export async function addHadiah(hadiah_name: string, img_url: string) {
  await supabase.auth.signInWithPassword({
    email: USER_EMAIL,
    password: USER_PASSWORD,
  })

  // get last no_urut from Hadiah table
  const { data: lastHadiah, error: lastHadiahError } = await supabase
    .from('Hadiah')
    .select('no_urut')
    .order('no_urut', { ascending: false })
    .limit(1)
    .single()
  if (lastHadiahError) throw lastHadiahError
  const nextNoUrut = (lastHadiah?.no_urut ?? 0) + 1

  const { data, error } = await supabase
    .from('Hadiah')
    .insert([{ nama: hadiah_name, img_url, no_urut: nextNoUrut }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getHadiah(isAll: boolean = false) {
  const query = supabase.from('Hadiah').select('*').order('no_urut', { ascending: true })

  if (!isAll) {
    query.is('pemenang', null) // Only get hadiah that have not been won
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function deleteHadiah(id: string | number) {
  await supabase.auth.signInWithPassword({
    email: USER_EMAIL,
    password: USER_PASSWORD,
  })

  const { data, error } = await supabase.from('Hadiah').delete().eq('id', id)

  if (error) throw error
  return data
}

export async function deletePemenangHadiah(pemenangId: number, pemenang_nik: string) {
  await supabase.auth.signInWithPassword({
    email: USER_EMAIL,
    password: USER_PASSWORD,
  })

  const { data: dataHadiah, error: errorHadiah } = await supabase
    .from('Hadiah')
    .update({ pemenang: null })
    .eq('pemenang', pemenangId)
    .select()
  if (errorHadiah) throw errorHadiah

  const { data: dataPeserta, error: errorPeserta } = await supabase
    .from('Peserta')
    .update({ status: false })
    .eq('nik', pemenang_nik)
    .select()
  if (errorPeserta) throw errorPeserta

  return { dataPeserta, dataHadiah }
}

export async function getDepartementList() {
  const { data, error } = await supabase
    .from('Departement')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return data
}

export const updateDepartementStatus = async (id: number, statusTarget: boolean) => {
  await supabase.auth.signInWithPassword({
    email: USER_EMAIL,
    password: USER_PASSWORD,
  })

  const { data, error } = await supabase
    .from('Departement')
    .update({ status: statusTarget })
    .eq('id', id)
    .select()
  if (error) throw error
  return data
}
