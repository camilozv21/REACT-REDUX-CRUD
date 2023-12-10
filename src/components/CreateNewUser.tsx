import { Badge, Button, Card, TextInput, Title } from "@tremor/react";
import { useUserActions } from "../hooks/useUserActions";
import { useState } from "react";

export function CreateNewUser() {
  const { addUser } = useUserActions();
  const [result, setResult] = useState<"ok" | "ko" | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setResult(null);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const github = formData.get("github") as string;

    if (!name || !email || !github) {
      return setResult("ko");
    }

    addUser({ name, email, github });
    setResult("ok");
    form.reset();
  };
  return (
    <Card className="mt-4">
      <Title>Create New User</Title>
      <form className="" onSubmit={handleSubmit}>
        <TextInput placeholder="Aqui el nombre" name="name" />
        <TextInput placeholder="Aqui el email" name="email" />
        <TextInput placeholder="Aqui el usuario de github" name="github" />

        <div>
          <Button type="submit">Crear usuario</Button>
          <span>
            {result === "ok" && (
              <Badge className="text-green-500 font-semibold">
                Usuario creado
              </Badge>
            )}
            {result === "ko" && (
              <Badge className="text-red-500 font-semibold">
                Error al crear usuario
              </Badge>
            )}
          </span>
        </div>
      </form>
    </Card>
  );
}
