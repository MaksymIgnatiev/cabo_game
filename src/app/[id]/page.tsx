"use client"

import Index from "@/app/page"
import { useParams } from "next/navigation"

export default function ID() {
	const { id } = useParams()
	return <Index id={Array.isArray(id) ? id[0] : id} />
}
