-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pin_number" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tax_certs" (
    "id" SERIAL NOT NULL,
    "user_address_id" INTEGER NOT NULL,
    "tax_cert_json" JSONB NOT NULL,

    CONSTRAINT "tax_certs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."addresses" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "legal_district_code" TEXT NOT NULL,
    "dong" TEXT,
    "ho" TEXT,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_addresses" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "address_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nickname" TEXT,

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."real_estates" (
    "id" SERIAL NOT NULL,
    "user_address_id" INTEGER NOT NULL,
    "real_estate_json" JSONB,

    CONSTRAINT "real_estates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."steps" (
    "id" SERIAL NOT NULL,
    "main_num" INTEGER NOT NULL,
    "sub_num" INTEGER NOT NULL,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."step_results" (
    "id" SERIAL NOT NULL,
    "user_address_id" INTEGER NOT NULL,
    "step_id" INTEGER NOT NULL,
    "mismatch" INTEGER,
    "match" INTEGER,
    "unchecked" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "step_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."primary_addresses" (
    "id" SERIAL NOT NULL,
    "user_address_id" INTEGER NOT NULL,

    CONSTRAINT "primary_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_unique_name" ON "public"."users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_unique_nickname" ON "public"."users"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "users_unique_username" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_unique_password" ON "public"."users"("password");

-- CreateIndex
CREATE UNIQUE INDEX "users_unique_pin_number" ON "public"."users"("pin_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_unique_phone_number" ON "public"."users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "tax_certs_unique" ON "public"."tax_certs"("tax_cert_json");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_coordinate" ON "public"."addresses"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "public"."tax_certs" ADD CONSTRAINT "tax_certs_user_address_id_fkey" FOREIGN KEY ("user_address_id") REFERENCES "public"."user_addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_addresses" ADD CONSTRAINT "user_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_addresses" ADD CONSTRAINT "user_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."real_estates" ADD CONSTRAINT "real_estates_user_address_id_fkey" FOREIGN KEY ("user_address_id") REFERENCES "public"."user_addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."step_results" ADD CONSTRAINT "step_results_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "public"."steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."step_results" ADD CONSTRAINT "step_results_user_address_id_fkey" FOREIGN KEY ("user_address_id") REFERENCES "public"."user_addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."primary_addresses" ADD CONSTRAINT "primary_addresses_user_address_id_fkey" FOREIGN KEY ("user_address_id") REFERENCES "public"."user_addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
