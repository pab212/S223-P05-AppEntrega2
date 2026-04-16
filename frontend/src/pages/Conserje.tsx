import type { FormEvent } from "react";

const Conserje = () => {
  const handleMockSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      residentName: formData.get("residentName") as string,
      apartment: formData.get("apartment") as string,
      courier: formData.get("courier") as string,
      description: formData.get("description") as string,
    };

    console.log("MOCK SUBMIT:", data);
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Registrar Encomienda</h2>

      <form
        onSubmit={handleMockSubmit}
        className="flex max-w-md flex-col gap-4"
      >
        <input
          name="residentName"
          placeholder="Nombre del Residente"
          className="border p-2"
        />
        <input
          name="apartment"
          placeholder="Departamento"
          className="border p-2"
        />
        <input name="courier" placeholder="Courier" className="border p-2" />
        <textarea
          name="description"
          placeholder="Descripcion"
          className="border p-2"
        />

        <button type="submit" className="rounded bg-blue-500 p-2 text-white">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Conserje;
