import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const conteudo = JSON.parse(readFileSync("src/content/levels.json", "utf8"));

async function jogar(page, acertar) {
  await page.goto("./");
  await page.getByTestId("iniciar").click();
  for (const fase of conteudo.fases) {
    for (const d of fase.desafios) {
      if (await page.getByTestId("tela-fim").count()) return;
      const alvo = acertar ? d.bug : (d.bug + 1) % d.codigo.length;
      await page.getByTestId(`linha-${alvo}`).click();
      await expect(page.getByTestId("feedback")).toBeVisible();
      await page.getByTestId("continuar").click();
    }
    if (await page.getByTestId("fase-concluida").count()) await page.getByTestId("continuar").click();
  }
}

test("regressão: completa todas as fases e chega à tela de fim", async ({ page }) => {
  await jogar(page, true);
  await expect(page.getByTestId("resultado")).toContainText("concluiu todas as fases");
  await expect(page.getByTestId("patente")).toContainText("Mestre dos Bugs");
});

test("regressão: errar três vezes termina o jogo", async ({ page }) => {
  await jogar(page, false);
  await expect(page.getByTestId("tela-fim")).toBeVisible();
  await expect(page.getByTestId("resultado")).toHaveText("Fim de jogo");
});

test("regressão: é possível jogar de novo depois do fim", async ({ page }) => {
  await jogar(page, true);
  await page.getByTestId("reiniciar").click();
  await expect(page.getByTestId("pontos")).toHaveText("Pontos: 0");
});
