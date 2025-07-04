'use client'

export default function ArticleTable() {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-2">Daftar Artikel</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">#</th>
            <th className="p-2">Judul</th>
            <th className="p-2">Kategori</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-t">1</td>
            <td className="p-2 border-t">Contoh Artikel</td>
            <td className="p-2 border-t">Teknologi</td>
            <td className="p-2 border-t">Edit | Hapus</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
