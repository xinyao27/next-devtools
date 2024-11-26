export default function ProfileDetail({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Profile Detail</h1>
      <p>{params.id}</p>
    </div>
  )
}
