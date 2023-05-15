import { ChangeEvent, useRef, useState } from 'react'
import { Input } from 'antd'
import { useRecoilState } from 'recoil'
import { postFormState } from '@/common/store'
import { useFillPostFormsFromRouter } from '@/common/hooks/useFillPostFormsFromRouter'
import PublishFormUI from './publishForm.presenter'
import { IPublishFormProps } from './publishForm.types'

const dummyDataSeries = [
  { id: '', title: '시리즈 없음' },
  { id: '1', title: 'series 1' },
  { id: '2', title: 'series 2' },
  { id: '3', title: 'series 3' },
]

export default function PublishForm({ isEditMode }: IPublishFormProps) {
  const [post] = useRecoilState(postFormState)
  const fileRef = useRef<HTMLInputElement>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string>()

  const { publishForm } = useFillPostFormsFromRouter()

  const { TextArea } = Input

  const handleClickUploadHandler = () => {
    fileRef.current?.click()
  }

  const handleChangeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    // TODO: try-catch with upload to Server

    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = event => {
      if (typeof event.target?.result === 'string') {
        setThumbnailUrl(event.target?.result)
      }
    }
  }

  const handleSubmitForm = (values: any) => {
    // TODO: replace thumbnail:thumbnailUrl with actual server url
    const publishablePostData = { ...post, ...values }
    alert(`submitting publish form with ${JSON.stringify(publishablePostData)}`)
  }

  return (
    <PublishFormUI
      isEditMode={isEditMode}
      fileRef={fileRef}
      thumbnailUrl={post.image ? post.image : thumbnailUrl}
      TextArea={TextArea}
      handleSubmitForm={handleSubmitForm}
      handleClickUploadHandler={handleClickUploadHandler}
      handleChangeFile={handleChangeFile}
      series={dummyDataSeries}
      form={publishForm}
    />
  )
}