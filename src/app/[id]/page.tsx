"use client"

import Index from "@/app/page"
import { useParams } from "next/navigation"

export default function ID() {
	const router = useParams(),
		{ id } = router
	return <Index id={Array.isArray(id) ? id[0] : id} />
}
