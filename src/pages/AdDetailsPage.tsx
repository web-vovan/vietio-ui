import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	AppRoot,
} from '@telegram-apps/telegram-ui'

import { ImageGallery } from '../components/ImageGallery'
import { AdDetailHeader } from '../components/AdDetailHeader'
import { MessageButton } from '../components/MessageButton'
import { AdDetailInfo } from '../components/AdDetailInfo'
import { AdDetailLoader } from '../components/AdDetailLoader'
import { AdDetailError } from '../components/AdDetailError'
import { AdDetail } from '../types'
import { apiClient } from '../api/apiClient'

export const AdDetailsPage = () => {
	const { uuid } = useParams()

	const [ad, setAd] = useState<AdDetail | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchAdDetails = async () => {
			try {
				setIsLoading(true)

				const response = await apiClient(`/api/ads/${uuid}`)

				if (!response.ok) throw new Error('Объявление не найдено')

				const rawData = await response.json()

				const adaptedAd: AdDetail = {
					uuid: rawData.uuid,
					title: rawData.title,
					price: rawData.price,
					currency: 'VND',
					city: rawData.city,
					description: rawData.description,
					images: rawData.images,
					created_at: rawData.created_at,
				}

				setAd(adaptedAd)
			} catch (err) {
				console.error(err)
				setError('Не удалось загрузить объявление')
			} finally {
				setIsLoading(false)
			}
		}

		fetchAdDetails()
	}, [uuid])

	if (isLoading) {
		return <AdDetailLoader />
	}

	if (error || !ad) {
		return <AdDetailError error='Объявление не найдено' />
	}

	return (
		<AppRoot>
			<AdDetailHeader />

			<div style={{ paddingTop: 60, paddingBottom: 100 }}>
				<ImageGallery images={ad.images || []} />

				<AdDetailInfo 
					title={ad.title}
					price={ad.price} 
					description={ad.description}
					date={ad.created_at}
					city={ad.city}
				/>
			</div>

			<MessageButton />
		</AppRoot>
	)
}

