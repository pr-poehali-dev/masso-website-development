import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";

const ACCENT = "hsl(185, 85%, 32%)";

export default function Privacy() {
  return (
    <div style={{ background: "#f8f8f6", minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <DokNavbar />
      <div style={{ paddingTop: 80 }}>
        <section style={{ background: "#1a1a1a", padding: "60px 24px 48px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>Документы</div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: "#fff", margin: 0 }}>
              Политика <span style={{ color: ACCENT }}>конфиденциальности</span>
            </h1>
          </div>
        </section>

        <section style={{ padding: "48px 24px 80px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 32, fontSize: 13, color: "#555", lineHeight: 1.7, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>УТВЕРЖДЕНА</div>
              <div>Приказ ИП Водопьянов С.Г. № 2 от 24.03.2008 г.</div>
              <div>Размещена на сайте: <a href="https://massopro.ru/privacy" style={{ color: ACCENT }}>massopro.ru/privacy</a></div>
              <div>Дата размещения: 27.03.2008 г.</div>
            </div>

            <div style={{ fontSize: 15, lineHeight: 1.8, color: "#3a3a3a", display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ margin: 0 }}>Настоящая Политика конфиденциальности регулирует порядок обработки и использования персональных данных физических лиц, пользующихся сервисами Сайта <a href="https://massopro.ru" style={{ color: ACCENT }}>https://massopro.ru</a> Индивидуальным предпринимателем Водопьяновым Сергеем Геннадьевичем (далее — Оператор).</p>
              <p style={{ margin: 0 }}>Передавая Оператору персональные данные посредством использования Сайта и регистрации на Сайте, Пользователь дает свое согласие (добровольное и бессрочное) на использование персональных данных на условиях, изложенных в настоящей Политике конфиденциальности.</p>
              <p style={{ margin: 0 }}>Если Пользователь не согласен с условиями настоящей Политики конфиденциальности, он обязан прекратить использование Сайта.</p>

              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", margin: "8px 0 0" }}>1. Термины</h2>
              <p style={{ margin: 0 }}><b>1.1. Сайт</b> — сайт, расположенный по адресу <a href="https://massopro.ru" style={{ color: ACCENT }}>https://massopro.ru</a>.</p>
              <p style={{ margin: 0 }}><b>1.2. Пользователь</b> — лицо, использующее Сайт.</p>
              <p style={{ margin: 0 }}><b>1.3. Персональные данные</b> — персональные данные Пользователя, которые Пользователь предоставляет о себе самостоятельно при регистрации или в процессе использования Сайта.</p>
              <p style={{ margin: 0 }}><b>1.4. Обработка персональных данных</b> — любое действие или совокупность действий, совершаемых с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение, использование, передачу, блокирование, удаление, уничтожение.</p>
              <p style={{ margin: 0 }}><b>1.5. Конфиденциальность персональных данных</b> — обязательное требование не допускать распространения персональных данных без согласия субъекта.</p>

              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", margin: "8px 0 0" }}>2. Состав информации о Пользователях</h2>
              <p style={{ margin: 0 }}><b>2.1.</b> Оператор обрабатывает следующие персональные данные: имя, адрес электронной почты, номер телефона, почтовый адрес.</p>
              <p style={{ margin: 0 }}><b>2.2.</b> Обработка данных осуществляется исключительно в целях заключения и исполнения договоров. Персональные данные не распространяются и не передаются третьим лицам.</p>
              <p style={{ margin: 0 }}><b>2.3.</b> Пользователь может в любой момент отказаться от рассылки, направив запрос на <a href="mailto:massopro@mail.ru" style={{ color: ACCENT }}>massopro@mail.ru</a>.</p>

              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", margin: "8px 0 0" }}>3. Порядок обработки персональных данных</h2>
              <p style={{ margin: 0 }}><b>3.1.</b> Оператор обязуется использовать персональные данные в соответствии с Федеральным Законом «О персональных данных» № 152-ФЗ.</p>
              <p style={{ margin: 0 }}><b>3.2.</b> В отношении персональных данных Пользователя сохраняется их конфиденциальность, кроме случаев, когда указанные данные являются общедоступными.</p>
              <p style={{ margin: 0 }}><b>3.3.</b> Оператор хранит персональные данные только на серверах на территории Российской Федерации.</p>
              <p style={{ margin: 0 }}><b>3.4.</b> Оператор имеет право передавать персональные данные без согласия Пользователя только государственным органам по их мотивированному запросу или в иных случаях, предусмотренных законодательством РФ.</p>
            </div>
          </div>
        </section>
      </div>
      <DokFooter />
    </div>
  );
}
